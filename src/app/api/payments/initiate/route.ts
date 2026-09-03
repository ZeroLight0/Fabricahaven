import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { initiatePaymentSchema } from "@/lib/schemas";
import { zodErrorResponse } from "@/lib/apiResponse";
import { nairaToKobo } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  const parsed = initiatePaymentSchema.safeParse(await req.json());
  if (!parsed.success) {
    return zodErrorResponse(parsed.error);
  }
  const { submissionId } = parsed.data;

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { order: true },
  });

  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  if (!submission.chosenTemplateId || !submission.tailorId || !submission.totalPrice) {
    return NextResponse.json(
      { error: "Submission is not finalized yet (choose a style and tailor first)" },
      { status: 400 }
    );
  }

  if (submission.order) {
    return NextResponse.json({ error: "Payment already initiated for this submission" }, { status: 400 });
  }

  const reference = `fabrica_${submission.id}_${randomUUID()}`;
  const amountKobo = nairaToKobo(submission.totalPrice);

  const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: submission.email,
      amount: amountKobo,
      reference,
      callback_url: `${process.env.APP_URL}/payment/callback?submissionId=${submission.id}`,
    }),
  });

  const paystackData = await paystackRes.json();

  if (!paystackRes.ok || !paystackData.status) {
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 502 });
  }

  await prisma.order.create({
    data: {
      submissionId: submission.id,
      paystackReference: reference,
      amount: submission.totalPrice,
    },
  });

  return NextResponse.json({ authorizationUrl: paystackData.data.authorization_url, reference });
}
