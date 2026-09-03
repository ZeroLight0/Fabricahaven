import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReviewClient from "./ReviewClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { chosenTemplate: true, tailor: true },
  });

  if (
    !submission ||
    !submission.chosenTemplate ||
    !submission.tailor ||
    submission.totalPrice == null ||
    submission.yardsNeeded == null
  ) {
    notFound();
  }

  return (
    <ReviewClient
      submissionId={submission.id}
      fabricImageUrl={submission.fabricImageUrl}
      fabricLabel={submission.fabricLabel ?? ""}
      occasion={submission.occasion}
      measurements={submission.measurements as unknown as Record<string, number>}
      styleName={submission.chosenTemplate.name}
      styleImageUrl={submission.chosenTemplate.imageUrl}
      tailorName={submission.tailor.name}
      tailorLocation={submission.tailor.location}
      yardsNeeded={submission.yardsNeeded}
      totalPrice={submission.totalPrice}
    />
  );
}
