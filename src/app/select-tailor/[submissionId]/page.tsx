import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SelectTailorClient from "./SelectTailorClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SelectTailorPage({
  params,
  searchParams,
}: {
  params: Promise<{ submissionId: string }>;
  searchParams: Promise<{ styleId?: string }>;
}) {
  const { submissionId } = await params;
  const { styleId } = await searchParams;

  const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
  if (!submission || !styleId) {
    notFound();
  }

  const tailors = await prisma.tailor.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return (
    <SelectTailorClient submissionId={submissionId} styleId={styleId} tailors={tailors} />
  );
}
