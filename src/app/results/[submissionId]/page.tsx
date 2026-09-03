import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ResultsClient from "./ResultsClient";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      selections: {
        include: { template: true },
        orderBy: { rank: "asc" },
      },
    },
  });

  if (!submission) {
    notFound();
  }

  return <ResultsClient submissionId={submission.id} selections={submission.selections} />;
}
