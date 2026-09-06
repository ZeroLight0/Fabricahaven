"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedLoadingText from "@/components/AnimatedLoadingText";

export default function PaymentStatus({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (attempts >= 20) return;
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/orders/status?submissionId=${submissionId}`);
      const data = await res.json();
      if (data.status && data.status !== "PENDING_PAYMENT") {
        router.refresh();
      } else {
        setAttempts((a) => a + 1);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [attempts, submissionId, router]);

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
