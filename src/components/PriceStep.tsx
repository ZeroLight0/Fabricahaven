"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function PriceStep({ value, onChange }: Props) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-espresso">Price per yard (NGN)</span>
      <input
        type="number"
        min={0}
        step="1"
        className="mt-1 block w-full rounded-md border border-taupe/40 bg-white/60 px-3 py-2 text-sm focus:border-espresso focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. 5000"
      />
    </label>
  );
}
