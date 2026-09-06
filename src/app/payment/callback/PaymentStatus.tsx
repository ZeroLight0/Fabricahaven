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
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

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

  async function handleCheckAgain() {
    setChecking(true);
    setCheckError(null);
    try {
      // Actively ask Paystack for the real status instead of just
      // re-reading our own record — this can unstick things even if the
      // webhook never reaches us.
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });
      const data = await res.json();
      if (res.ok && data.status && data.status !== "PENDING_PAYMENT") {
        router.refresh();
        return;
      }
      if (!res.ok) {
        setCheckError(data.error ?? "Could not check payment status. Please try again.");
      }
    } catch {
      setCheckError("Could not check payment status. Please try again.");
    } finally {
      setChecking(false);
      setAttempts(0); // resume passive polling as a fallback either way
    }
  }

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
        {checkError && (
          <p className="text-sm text-red-700 mt-3" role="alert">
            {checkError}
          </p>
        )}
        <button
          type="button"
          onClick={handleCheckAgain}
          disabled={checking}
          className="mt-6 rounded-full px-6 py-2.5 text-sm font-medium bg-espresso text-cream hover:bg-espresso/90 transition-colors disabled:opacity-60"
        >
          {checking ? "Checking…" : "Check again"}
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
