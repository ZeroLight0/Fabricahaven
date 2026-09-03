"use client";

import { OCCASIONS, type OccasionValue } from "@/lib/types";

interface Props {
  value: OccasionValue | null;
  onChange: (value: OccasionValue) => void;
}

export default function OccasionStep({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {OCCASIONS.map((occasion) => (
        <button
          key={occasion.value}
          type="button"
          onClick={() => onChange(occasion.value)}
          className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
            value === occasion.value
              ? "border-stone-900 bg-stone-900 text-white"
              : "border-stone-300 hover:border-stone-400"
          }`}
        >
          {occasion.label}
        </button>
      ))}
    </div>
  );
}
