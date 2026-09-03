"use client";

import { NDPA_NOTICE } from "@/lib/types";

export interface ContactDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Props {
  value: ContactDetails;
  onChange: (value: ContactDetails) => void;
}

export default function ContactDetailsStep({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Full name</span>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Email</span>
        <input
          type="email"
          className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Phone</span>
        <input
          type="tel"
          className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          value={value.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-stone-700">Delivery / pickup address</span>
        <textarea
          rows={2}
          className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
        />
      </label>
      <p className="text-xs text-stone-500">{NDPA_NOTICE}</p>
    </div>
  );
}
