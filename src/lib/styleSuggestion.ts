import { z } from "zod";
import { GarmentCategory, Occasion } from "@prisma/client";
import { generateGeminiContent } from "./gemini";

export interface TemplateForPrompt {
  id: string;
  name: string;
  garment: GarmentCategory;
  occasions: Occasion[];
}

const styleSuggestionResponseSchema = {
  type: "OBJECT",
  properties: {
    suggestions: {
      type: "ARRAY",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "OBJECT",
        properties: {
          templateId: { type: "STRING" },
          reason: { type: "STRING" },
        },
        required: ["templateId", "reason"],
      },
    },
  },
  required: ["suggestions"],
};

const suggestionSchema = z.object({
  suggestions: z
    .array(
      z.object({
        templateId: z.string(),
        reason: z.string(),
      })
    )
    .length(5),
});

export interface StyleSuggestionPick {
  templateId: string;
  reason: string;
}

export async function suggestStyles(
  fabricDescription: string,
  occasion: Occasion,
  templates: TemplateForPrompt[]
): Promise<StyleSuggestionPick[]> {
  const templateList = templates
    .map(
      (t) =>
        `- id: ${t.id} | name: ${t.name} | garment: ${t.garment} | occasions: ${t.occasions.join(", ")}`
    )
    .join("\n");

  const prompt = `You are a tailoring stylist helping a customer pick a garment style to sew from fabric they already own.

Customer's confirmed fabric description: ${fabricDescription}

Occasion: ${occasion}

Available style templates (choose only from this list, by id):
${templateList}

Rank the best 5 templates for this fabric and occasion, considering:
1. Occasion fit — does the template's occasion tags reasonably suit the requested occasion?
2. Pattern scale — busy/high-contrast prints generally suit simpler silhouettes; plain/solid fabrics suit more structured or statement silhouettes.
3. Fabric convention — e.g. lace/aso-oke reads more formal/traditional; casual cottons read casual.

Important: you cannot judge fabric drape or stiffness from a text description of a photo — this is a real limitation. Do not overclaim precision about drape, weight, or stiffness. When uncertain, favor safer, broadly-appropriate matches rather than a highly specific silhouette claim.

Respond with ONLY a JSON array of exactly 5 objects, ranked best first, in this exact shape:
[{"templateId": "...", "reason": "..."}]

Each "reason" must be under 15 words and reference the fabric or occasion fit. Use only template ids from the list above.`;

  const responseText = await generateGeminiContent(
    [{ text: prompt }],
    styleSuggestionResponseSchema,
    4096
  );

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Style suggestion response did not contain a JSON object");
  }

  const parsed = suggestionSchema.parse(JSON.parse(jsonMatch[0]));

  const validIds = new Set(templates.map((t) => t.id));
  const filtered = parsed.suggestions.filter((pick) => validIds.has(pick.templateId));

  if (filtered.length < 5) {
    throw new Error("Style suggestion returned templateIds outside the provided list");
  }

  return filtered;
}
