"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TailorCard from "@/components/TailorCard";

interface Tailor {
  id: string;
  name: string;
  photoUrl: string;
  specialtyTags: string;
  location: string;
}

interface Props {
  submissionId: string;
  styleId: string;
  tailors: Tailor[];
}

export default function SelectTailorClient({ submissionId, styleId, tailors }: Props) {
  const router = useRouter();
  const [tailorId, setTailorId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function proceed() {
    if (!tailorId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/submissions/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, chosenTemplateId: styleId, tailorId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      router.push(`/review/${submissionId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex-1 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold">Pick your tailor</h1>
        <p className="text-sm text-stone-500 mt-2">
          Choose who will make your piece. This doesn&apos;t change your style suggestions.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          {tailors.map((t) => (
            <TailorCard
              key={t.id}
              name={t.name}
              photoUrl={t.photoUrl}
              specialtyTags={t.specialtyTags}
              location={t.location}
              selected={tailorId === t.id}
              onSelect={() => setTailorId(t.id)}
            />
          ))}
        </div>

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            disabled={!tailorId || submitting}
            onClick={proceed}
            className="rounded-full px-6 py-2.5 text-sm font-medium bg-stone-900 text-white disabled:opacity-40"
          >
            {submitting ? "Saving…" : "Continue to review"}
          </button>
        </div>
      </div>
    </main>
  );
}
