import { prisma } from "./prisma";
import { sendTailorOrderNotification } from "./tailorEmail";
import { nairaToKobo } from "./pricing";
import type { OrderStatus } from "@prisma/client";

// Paystack transaction statuses that mean the charge definitely did not
// succeed. Anything else (network hiccup verifying, "pending", an unknown
// status) is left as-is rather than flipped to FAILED — a flaky read of
// Paystack's API should never permanently fail a payment that may still
// come through.
const TERMINAL_FAILURE_STATUSES = new Set(["failed", "abandoned", "reversed"]);

/**
 * Re-verifies a transaction directly against Paystack (never trusts a
 * webhook payload or the caller alone) and updates the Order accordingly.
 * Shared by the webhook handler and the user-triggered manual "Check
 * again" path, so both go through the exact same verification and
 * side-effects (marking PAID, emailing the tailor).
 */
export async function verifyAndUpdateOrder(
  reference: string
): Promise<OrderStatus | "NOT_FOUND"> {
  const order = await prisma.order.findUnique({
    where: { paystackReference: reference },
    include: { submission: { include: { chosenTemplate: true, tailor: true } } },
  });

  if (!order) return "NOT_FOUND";
  if (order.status === "PAID") return "PAID";

  const verifyRes = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
  );
  const verifyData = await verifyRes.json();

  const verifiedStatus = verifyData?.data?.status;
  const verifiedAmountKobo = verifyData?.data?.amount;
  const expectedAmountKobo = nairaToKobo(order.amount);

  const isVerifiedPaid =
    verifyRes.ok &&
    verifiedStatus === "success" &&
    typeof verifiedAmountKobo === "number" &&
    verifiedAmountKobo >= expectedAmountKobo;

  if (isVerifiedPaid) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", paystackTxId: String(verifyData.data.id) },
    });

    const { submission } = order;
    if (
      submission.tailor &&
      submission.chosenTemplate &&
      submission.yardsNeeded &&
      submission.totalPrice
    ) {
      try {
        await sendTailorOrderNotification({
          tailorEmail: submission.tailor.email,
          tailorName: submission.tailor.name,
          styleName: submission.chosenTemplate.name,
          customerName: submission.name,
          customerPhone: submission.phone,
          customerAddress: submission.address,
          occasion: submission.occasion,
          yardsNeeded: submission.yardsNeeded,
          totalPrice: submission.totalPrice,
          fabricImageUrl: submission.fabricImageUrl,
          styleImageUrl: submission.chosenTemplate.imageUrl,
        });
      } catch (err) {
        console.error("Failed to send tailor notification email", { orderId: order.id, err });
      }
    }

    return "PAID";
  }

  if (verifyRes.ok && TERMINAL_FAILURE_STATUSES.has(verifiedStatus)) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED", paystackTxId: verifyData?.data?.id ? String(verifyData.data.id) : null },
    });
    return "FAILED";
  }

  // Genuinely undetermined (still processing, or the verify call itself
  // failed) — leave the order pending rather than guessing.
  return order.status;
}
