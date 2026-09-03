import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendTailorOrderNotification } from "@/lib/tailorEmail";
import { nairaToKobo } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY ?? "")
    .update(rawBody)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  const providedBuffer = Buffer.from(signature, "hex");
  const isValidSignature =
    expectedBuffer.length === providedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, providedBuffer);

  if (!isValidSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const reference = event.data?.reference;
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { paystackReference: reference },
    include: { submission: { include: { chosenTemplate: true, tailor: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status === "PAID") {
    return NextResponse.json({ received: true });
  }

  // Do not trust the webhook payload alone — re-verify directly against Paystack.
  const verifyRes = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
  );
  const verifyData = await verifyRes.json();

  const verifiedStatus = verifyData?.data?.status;
  const verifiedAmountKobo = verifyData?.data?.amount;
  const expectedAmountKobo = nairaToKobo(order.amount);

  const isVerified =
    verifyRes.ok &&
    verifiedStatus === "success" &&
    typeof verifiedAmountKobo === "number" &&
    verifiedAmountKobo >= expectedAmountKobo;

  if (!isVerified) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED", paystackTxId: verifyData?.data?.id ? String(verifyData.data.id) : null },
    });
    return NextResponse.json({ received: true });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "PAID", paystackTxId: String(verifyData.data.id) },
  });

  const { submission } = order;
  if (submission.tailor && submission.chosenTemplate && submission.yardsNeeded && submission.totalPrice) {
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

  return NextResponse.json({ received: true });
}
