"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FabricUploadStep from "@/components/FabricUploadStep";
import OccasionStep from "@/components/OccasionStep";
import MeasurementsStep from "@/components/MeasurementsStep";
import PriceStep from "@/components/PriceStep";
import ContactDetailsStep, { type ContactDetails } from "@/components/ContactDetailsStep";
import type { FabricSuggestion, MeasurementsInput, OccasionValue } from "@/lib/types";

const STEP_TITLES = [
  "Fabric photo",
  "Occasion",
  "Measurements",
  "Fabric pricing",
  "Contact details",
];

export default function SubmitPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fabricImageUrl, setFabricImageUrl] = useState<string | null>(null);
  const [fabricPreviewUrl, setFabricPreviewUrl] = useState<string | null>(null);
  const [fabricLabel, setFabricLabel] = useState("");
  const [, setFabricSuggestion] = useState<FabricSuggestion | null>(null);

  const [occasion, setOccasion] = useState<OccasionValue | null>(null);

  const [measurements, setMeasurements] = useState<MeasurementsInput>({
    bust: "",
    waist: "",
    hips: "",
    shoulder: "",
    length: "",
  });

  const [pricePerYard, setPricePerYard] = useState("");

  const [contact, setContact] = useState<ContactDetails>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const canProceed = (() => {
    switch (step) {
      case 0:
        return Boolean(fabricImageUrl && fabricLabel.trim());
      case 1:
        return Boolean(occasion);
      case 2:
        return Object.values(measurements).every((v) => v.trim() !== "" && Number(v) > 0);
      case 3:
        return Number(pricePerYard) > 0;
      case 4:
        return (
          contact.name.trim() !== "" &&
          contact.email.trim() !== "" &&
          contact.phone.trim() !== "" &&
          contact.address.trim() !== ""
        );
      default:
        return false;
    }
  })();

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          address: contact.address,
          occasion,
          fabricImageUrl,
          fabricLabel,
          pricePerYard: Number(pricePerYard),
          measurements: {
            bust: Number(measurements.bust),
            waist: Number(measurements.waist),
            hips: Number(measurements.hips),
            shoulder: Number(measurements.shoulder),
            length: Number(measurements.length),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      router.push(`/results/${data.submission.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">
            Step {step + 1} of {STEP_TITLES.length}
          </p>
          <h1 className="text-2xl font-semibold mt-1">{STEP_TITLES[step]}</h1>
          <div className="mt-3 h-1 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-stone-900 transition-all"
              style={{ width: `${((step + 1) / STEP_TITLES.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          {step === 0 && (
            <FabricUploadStep
              fabricImageUrl={fabricImageUrl}
              fabricLabel={fabricLabel}
              previewUrl={fabricPreviewUrl}
              onUploaded={(url, preview, suggestion) => {
                setFabricImageUrl(url);
                setFabricPreviewUrl(preview);
                setFabricSuggestion(suggestion);
              }}
              onLabelChange={setFabricLabel}
            />
          )}
          {step === 1 && <OccasionStep value={occasion} onChange={setOccasion} />}
          {step === 2 && <MeasurementsStep value={measurements} onChange={setMeasurements} />}
          {step === 3 && <PriceStep value={pricePerYard} onChange={setPricePerYard} />}
          {step === 4 && <ContactDetailsStep value={contact} onChange={setContact} />}
        </div>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="flex justify-between">
          <button
            type="button"
            disabled={step === 0 || submitting}
            onClick={() => setStep((s) => s - 1)}
            className="rounded-full px-6 py-2.5 text-sm font-medium border border-stone-300 disabled:opacity-40"
          >
            Back
          </button>

          {step < STEP_TITLES.length - 1 ? (
            <button
              type="button"
              disabled={!canProceed}
              onClick={() => setStep((s) => s + 1)}
              className="rounded-full px-6 py-2.5 text-sm font-medium bg-stone-900 text-white disabled:opacity-40"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              disabled={!canProceed || submitting}
              onClick={handleSubmit}
              className="rounded-full px-6 py-2.5 text-sm font-medium bg-stone-900 text-white disabled:opacity-40"
            >
              {submitting ? "Getting suggestions…" : "Submit"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
