"use client";

import type { MeasurementsInput } from "@/lib/types";

interface Props {
  value: MeasurementsInput;
  onChange: (value: MeasurementsInput) => void;
}

const FIELDS: { key: keyof MeasurementsInput; label: string }[] = [
  { key: "bust", label: "Bust (cm)" },
  { key: "waist", label: "Waist (cm)" },
  { key: "hips", label: "Hips (cm)" },
  { key: "shoulder", label: "Shoulder (cm)" },
  { key: "length", label: "Length (cm)" },
];

export default function MeasurementsStep({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {FIELDS.map((field) => (
        <label key={field.key} className="block">
          <span className="text-sm font-medium text-espresso">{field.label}</span>
          <input
            type="number"
            min={0}
            step="0.1"
            className="mt-1 block w-full rounded-md border border-taupe/40 bg-white/60 px-3 py-2 text-sm focus:border-espresso focus:outline-none"
            value={value[field.key]}
            onChange={(e) => onChange({ ...value, [field.key]: e.target.value })}
          />
        </label>
      ))}
    </div>
  );
}
