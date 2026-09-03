"use client";

import { OCCASIONS, type OccasionValue } from "@/lib/types";

interface Props {
  value: OccasionValue | null;
  onChange: (value: OccasionValue) => void;
}

export default function OccasionStep({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Occasion">
      {OCCASIONS.map((occasion) => (
        <button
          key={occasion.value}
          type="button"
          role="radio"
          aria-checked={value === occasion.value}
          onClick={() => onChange(occasion.value)}
          className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
            value === occasion.value
              ? "border-espresso bg-espresso text-cream"
              : "border-taupe/40 text-espresso hover:border-espresso/60 hover:bg-blush/30"
          }`}
        >
          {occasion.label}
        </button>
      ))}
    </div>
  );
}
