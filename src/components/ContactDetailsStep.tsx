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

const inputClasses =
  "mt-1 block w-full rounded-md border border-taupe/40 bg-white/60 px-3 py-2 text-sm focus:border-espresso focus:outline-none";

export default function ContactDetailsStep({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <label className="block">
        <span className="text-sm font-medium text-espresso">Full name</span>
        <input
          type="text"
          className={inputClasses}
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-espresso">Email</span>
        <input
          type="email"
          className={inputClasses}
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-espresso">Phone</span>
        <input
          type="tel"
          className={inputClasses}
          value={value.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-espresso">Delivery / pickup address</span>
        <textarea
          rows={2}
          className={inputClasses}
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
        />
      </label>
      <p className="text-xs text-espresso-muted">{NDPA_NOTICE}</p>
    </div>
  );
}
