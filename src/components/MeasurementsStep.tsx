"use client";

import type { GenderValue, MeasurementsInput } from "@/lib/types";

interface Props {
  value: MeasurementsInput;
  onChange: (value: MeasurementsInput) => void;
  gender: GenderValue | null;
}

type Field = { key: keyof MeasurementsInput; label: string };

const FEMALE_FIELDS: Field[] = [
  { key: "bust", label: "Bust (cm)" },
  { key: "waist", label: "Waist (cm)" },
  { key: "hips", label: "Hips (cm)" },
  { key: "shoulder", label: "Shoulder (cm)" },
  { key: "length", label: "Length (cm)" },
];

const MALE_FIELDS: Field[] = [
  { key: "neck", label: "Neck (cm)" },
  { key: "bust", label: "Chest (cm)" },
  { key: "shoulder", label: "Shoulder (cm)" },
  { key: "sleeveLength", label: "Sleeve Length (cm)" },
  { key: "waist", label: "Waist (cm)" },
  { key: "hips", label: "Hips (cm)" },
  { key: "length", label: "Trouser/Garment Length (cm)" },
];

export default function MeasurementsStep({ value, onChange, gender }: Props) {
  const fields = gender === "MALE" ? MALE_FIELDS : FEMALE_FIELDS;

  return (
    <div className="grid grid-cols-2 gap-4">
      {fields.map((field) => (
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
