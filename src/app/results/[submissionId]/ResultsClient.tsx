"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StyleSuggestionCard from "@/components/StyleSuggestionCard";
import { COMMISSION_NOTICE, STYLE_DISCLAIMER } from "@/lib/types";

interface Selection {
  id: string;
  templateId: string;
  reason: string;
  yardsNeeded: number;
  totalPrice: number;
  template: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

interface Props {
  submissionId: string;
  selections: Selection[];
}

export default function ResultsClient({ submissionId, selections }: Props) {
  const router = useRouter();
  const [chosenTemplateId, setChosenTemplateId] = useState<string | null>(null);

  function proceed() {
    if (!chosenTemplateId) return;
    router.push(`/select-tailor/${submissionId}?styleId=${chosenTemplateId}`);
  }

  return (
    <main className="flex-1 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold">Suggested styles for your fabric</h1>
        <p className="text-sm text-stone-500 mt-2">{STYLE_DISCLAIMER}</p>
        <p className="text-sm font-medium mt-4 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 inline-block">
          {COMMISSION_NOTICE}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          {selections.map((s) => (
            <StyleSuggestionCard
              key={s.id}
              name={s.template.name}
              imageUrl={s.template.imageUrl}
              reason={s.reason}
              yardsNeeded={s.yardsNeeded}
              totalPrice={s.totalPrice}
              selected={chosenTemplateId === s.templateId}
              onSelect={() => setChosenTemplateId(s.templateId)}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            disabled={!chosenTemplateId}
            onClick={proceed}
            className="rounded-full px-6 py-2.5 text-sm font-medium bg-stone-900 text-white disabled:opacity-40"
          >
            Continue to pick a tailor
          </button>
        </div>
      </div>
    </main>
  );
}
