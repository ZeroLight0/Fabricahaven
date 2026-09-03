import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { finalizeSubmissionSchema } from "@/lib/schemas";
import { zodErrorResponse } from "@/lib/apiResponse";

export async function POST(req: NextRequest) {
  const parsed = finalizeSubmissionSchema.safeParse(await req.json());
  if (!parsed.success) {
    return zodErrorResponse(parsed.error);
  }
  const { submissionId, chosenTemplateId, tailorId } = parsed.data;

  const selection = await prisma.styleSelection.findFirst({
    where: { submissionId, templateId: chosenTemplateId },
  });

  if (!selection) {
    return NextResponse.json(
      {
        error: "Invalid input",
        fieldErrors: { chosenTemplateId: ["Not one of the suggested styles for this submission"] },
      },
      { status: 400 }
    );
  }

  const tailor = await prisma.tailor.findUnique({ where: { id: tailorId } });
  if (!tailor || !tailor.active) {
    return NextResponse.json(
      { error: "Invalid input", fieldErrors: { tailorId: ["Tailor not found or inactive"] } },
      { status: 400 }
    );
  }

  const submission = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      chosenTemplateId,
      tailorId,
      yardsNeeded: selection.yardsNeeded,
      totalPrice: selection.totalPrice,
    },
    include: { chosenTemplate: true, tailor: true },
  });

  return NextResponse.json({ submission });
}
