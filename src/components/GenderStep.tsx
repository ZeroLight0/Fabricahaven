"use client";

import { GENDERS, type GenderValue } from "@/lib/types";

interface Props {
  value: GenderValue | null;
  onChange: (value: GenderValue) => void;
}

export default function GenderStep({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Gender">
      {GENDERS.map((gender) => (
        <button
          key={gender.value}
          type="button"
          role="radio"
          aria-checked={value === gender.value}
          onClick={() => onChange(gender.value)}
          className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
            value === gender.value
              ? "border-espresso bg-espresso text-cream"
              : "border-taupe/40 text-espresso hover:border-espresso/60 hover:bg-blush/30"
          }`}
        >
          {gender.label}
        </button>
      ))}
    </div>
  );
}
