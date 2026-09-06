"use client";

import { useState } from "react";
import type { FabricSuggestion } from "@/lib/types";
import AnimatedLoadingText from "./AnimatedLoadingText";

interface Props {
  fabricImageUrl: string | null;
  fabricLabel: string;
  previewUrl: string | null;
  onUploaded: (fabricImageUrl: string, previewUrl: string, suggestion: FabricSuggestion) => void;
  onLabelChange: (label: string) => void;
}

export default function FabricUploadStep({
  fabricImageUrl,
  fabricLabel,
  previewUrl,
  onUploaded,
  onLabelChange,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setLoading(true);
    const localPreview = URL.createObjectURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/fabric-label", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not analyze that photo. Try another.");
        return;
      }

      const suggestion: FabricSuggestion = data.suggestion;
      const combinedLabel = `${suggestion.likelyType}, ${suggestion.colorway}, ${suggestion.patternDescription}`;
      setConfidence(suggestion.confidence);
      onUploaded(data.fabricImageUrl, localPreview, suggestion);
      onLabelChange(combinedLabel);
    } catch {
      setError("Something went wrong uploading your photo. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="block">
        <span className="text-sm font-medium text-espresso">Fabric photo</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-2 block w-full text-sm text-espresso-muted file:mr-3 file:rounded-full file:border-0 file:bg-espresso file:px-4 file:py-2 file:text-sm file:font-medium file:text-cream hover:file:bg-espresso/90 file:cursor-pointer"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </label>

      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Fabric preview"
          className="w-full max-h-64 object-cover rounded-lg border border-taupe/25"
        />
      )}

      {loading && <AnimatedLoadingText initialText="Analyzing your fabric…" />}
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}

      {fabricImageUrl && (
        <div>
          <label className="block">
            <span className="text-sm font-medium text-espresso">
              Fabric description {confidence !== null && (
                <span className="text-espresso-muted font-normal">
                  ({Math.round(confidence * 100)}% confidence — please confirm or edit)
                </span>
              )}
            </span>
            <textarea
              className="mt-2 block w-full rounded-md border border-taupe/40 bg-white/60 px-3 py-2 text-sm focus:border-espresso focus:outline-none"
              rows={2}
              value={fabricLabel}
              onChange={(e) => onLabelChange(e.target.value)}
            />
          </label>
        </div>
      )}
    </div>
  );
}
