"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="text-center">
      <h1 className="text-xl font-semibold">Confirming your payment…</h1>
      <p className="text-stone-500 mt-2">This usually takes a few seconds.</p>
    </div>
  );
}
