"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedLoadingText from "@/components/AnimatedLoadingText";

const MAX_ATTEMPTS = 20; // ~60s at 3s intervals
const POLL_INTERVAL_MS = 3000;

export default function PaymentStatus({
  submissionId,
  reference,
}: {
  submissionId: string;
  reference: string;
}) {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);

  const timedOut = attempts >= MAX_ATTEMPTS;

  useEffect(() => {
    if (timedOut) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/orders/status?submissionId=${submissionId}`);
        const data = await res.json();
        if (res.ok && data.status && data.status !== "PENDING_PAYMENT") {
          router.refresh();
          return;
        }
      } catch {
        // Transient network error — fall through and keep polling rather
        // than freezing on this attempt forever.
      }
      setAttempts((a) => a + 1);
    }, POLL_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [attempts, timedOut, submissionId, router]);

  if (timedOut) {
    return (
      <div className="text-center" role="status" aria-live="polite">
        <h1 className="font-display text-xl font-semibold">Still confirming your payment</h1>
        <p className="text-espresso-muted mt-2 max-w-sm">
          This is taking longer than expected. If you completed payment, it should
          still go through shortly — you can check again, or contact support with
          your reference below if this persists.
        </p>
        <p className="text-xs text-espresso-muted mt-3">Reference: {reference}</p>
        <button
          type="button"
          onClick={() => setAttempts(0)}
          className="mt-6 rounded-full px-6 py-2.5 text-sm font-medium bg-espresso text-cream hover:bg-espresso/90 transition-colors"
        >
          Check again
        </button>
      </div>
    );
  }

  return (
    <div className="text-center" role="status" aria-live="polite">
      <div
        aria-hidden="true"
        className="mx-auto mb-4 h-8 w-8 rounded-full border-2 border-dusty-rose border-t-espresso animate-spin"
      />
      <h1 className="font-display text-xl font-semibold">Confirming your payment…</h1>
      <AnimatedLoadingText
        initialText="This usually takes a few seconds."
        className="text-espresso-muted mt-2"
      />
    </div>
  );
}
