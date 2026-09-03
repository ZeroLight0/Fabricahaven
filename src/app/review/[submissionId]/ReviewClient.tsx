"use client";

import { useState } from "react";
import { COMMISSION_NOTICE, NDPA_NOTICE } from "@/lib/types";

interface Props {
  submissionId: string;
  fabricImageUrl: string;
  fabricLabel: string;
  occasion: string;
  measurements: Record<string, number>;
  styleName: string;
  styleImageUrl: string;
  tailorName: string;
  tailorLocation: string;
  yardsNeeded: number;
  totalPrice: number;
}

export default function ReviewClient({
  submissionId,
  fabricImageUrl,
  fabricLabel,
  occasion,
  measurements,
  styleName,
  styleImageUrl,
  tailorName,
  tailorLocation,
  yardsNeeded,
  totalPrice,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function payNow() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not start payment. Please try again.");
        setSubmitting(false);
        return;
      }
      window.location.href = data.authorizationUrl;
    } catch {
      setError("Could not start payment. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex-1 px-6 py-12">
      <div className="max-w-lg mx-auto rounded-2xl bg-white/50 border border-taupe/20 shadow-sm shadow-espresso/5 p-6 sm:p-8">
        <h1 className="font-display text-2xl font-semibold">Review your order</h1>

        <div className="mt-6 flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fabricImageUrl}
            alt="Your fabric"
            className="w-24 h-24 object-cover rounded-lg border border-taupe/25"
          />
          {styleImageUrl && styleImageUrl !== "PENDING_UPLOAD" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={styleImageUrl}
              alt={styleName}
              className="w-24 h-24 object-cover rounded-lg border border-taupe/25"
            />
          )}
        </div>

        <dl className="mt-6 divide-y divide-taupe/20 text-sm">
          <Row label="Fabric" value={fabricLabel} />
          <Row label="Occasion" value={occasion} />
          <Row
            label="Measurements"
            value={`Bust ${measurements.bust}, Waist ${measurements.waist}, Hips ${measurements.hips}, Shoulder ${measurements.shoulder}, Length ${measurements.length} (cm)`}
          />
          <Row label="Style" value={styleName} />
          <Row label="Tailor" value={`${tailorName} — ${tailorLocation}`} />
          <Row label="Yards needed" value={`${yardsNeeded}`} />
          <Row label="Fabric cost" value={`₦${totalPrice.toLocaleString()}`} />
        </dl>

        <p className="text-sm font-medium mt-6 bg-blush border border-dusty-rose/40 text-espresso rounded-md px-3 py-2">
          {COMMISSION_NOTICE}
        </p>
        <p className="text-xs text-espresso-muted mt-3">{NDPA_NOTICE}</p>

        {error && (
          <p className="text-sm text-red-700 mt-4" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={submitting}
          onClick={payNow}
          className="satin-sheen overflow-hidden mt-8 w-full rounded-full px-6 py-3 text-sm font-medium bg-espresso text-cream hover:bg-espresso/90 transition-colors disabled:opacity-40"
        >
          {submitting ? "Starting payment…" : `Pay Now — ₦${totalPrice.toLocaleString()}`}
        </button>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 flex justify-between gap-4">
      <dt className="text-espresso-muted">{label}</dt>
      <dd className="text-right font-medium text-espresso">{value}</dd>
    </div>
  );
}
