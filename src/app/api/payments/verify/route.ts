import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyAndUpdateOrder } from "@/lib/verifyPayment";
import { zodErrorResponse } from "@/lib/apiResponse";

const verifySchema = z.object({
  submissionId: z.string().min(1),
});

// User-triggered fallback for when Paystack's webhook hasn't (yet, or
// ever) reached /api/payments/webhook — actively asks Paystack for the
// real status instead of just re-reading our own possibly-stale record.
export async function POST(req: NextRequest) {
  const parsed = verifySchema.safeParse(await req.json());
  if (!parsed.success) {
    return zodErrorResponse(parsed.error);
  }

  const order = await prisma.order.findUnique({
    where: { submissionId: parsed.data.submissionId },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const status = await verifyAndUpdateOrder(order.paystackReference);

  if (status === "NOT_FOUND") {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ status });
}
