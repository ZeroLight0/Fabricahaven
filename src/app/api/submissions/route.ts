import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSubmissionSchema } from "@/lib/schemas";
import { zodErrorResponse } from "@/lib/apiResponse";
import { suggestStyles } from "@/lib/styleSuggestion";
import { GeminiQuotaExhaustedError } from "@/lib/gemini";
import { calculateYardage } from "@/lib/yardage";
import { calculatePrice } from "@/lib/pricing";
import { Occasion, Prisma } from "@prisma/client";

// gemini-3.6-flash spends a mandatory, non-disableable token budget on
// internal reasoning before answering (measured up to ~40s on a real
// request with 21 templates) — give the function room to not be killed
// by a platform timeout.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const parsed = createSubmissionSchema.safeParse(await req.json());
  if (!parsed.success) {
    return zodErrorResponse(parsed.error);
  }
  const input = parsed.data;

  const templates = await prisma.styleTemplate.findMany({
    where: { active: true },
    select: { id: true, name: true, garment: true, occasions: true, imageUrl: true },
  });

  if (templates.length === 0) {
    return NextResponse.json({ error: "No style templates available" }, { status: 500 });
  }

  let picks;
  try {
    picks = await suggestStyles(input.fabricLabel, input.occasion as Occasion, templates);
  } catch (err) {
    console.error("Style suggestion failed:", err);
    if (err instanceof GeminiQuotaExhaustedError) {
      return NextResponse.json(
        { error: "Our AI service has hit its daily limit — please try again tomorrow, or contact support." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Style suggestion failed, please try again" },
      { status: 502 }
    );
  }

  const templateById = new Map(templates.map((t) => [t.id, t]));

  const selectionsData = picks.map((pick, index) => {
    const template = templateById.get(pick.templateId)!;
    const yardsNeeded = calculateYardage(template.garment, input.measurements);
    const totalPrice = calculatePrice(yardsNeeded, input.pricePerYard);
    return {
      templateId: template.id,
      rank: index + 1,
      reason: pick.reason,
      yardsNeeded,
      totalPrice,
    };
  });

  const submission = await prisma.submission.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      occasion: input.occasion as Occasion,
      fabricImageUrl: input.fabricImageUrl,
      fabricLabel: input.fabricLabel,
      pricePerYard: input.pricePerYard,
      measurements: input.measurements as Prisma.InputJsonValue,
      selections: { create: selectionsData },
    },
    include: {
      selections: {
        include: { template: true },
        orderBy: { rank: "asc" },
      },
    },
  });

  return NextResponse.json({ submission });
}
