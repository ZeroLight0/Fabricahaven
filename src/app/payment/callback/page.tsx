import { prisma } from "@/lib/prisma";
import PaymentStatus from "./PaymentStatus";
import OrderSummary from "./OrderSummary";

export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ submissionId?: string }>;
}) {
  const { submissionId } = await searchParams;

  if (!submissionId) {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <p className="text-stone-600">Missing order reference.</p>
      </main>
    );
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { chosenTemplate: true, tailor: true, order: true },
  });

  if (!submission || !submission.order) {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <p className="text-stone-600">We couldn&apos;t find that order.</p>
      </main>
    );
  }

  if (submission.order.status === "PENDING_PAYMENT") {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <PaymentStatus submissionId={submissionId} />
      </main>
    );
  }

  if (submission.order.status === "FAILED") {
    return (
      <main className="flex-1 flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-xl font-semibold text-red-600">Payment could not be verified</h1>
          <p className="text-stone-500 mt-2">
            If you were charged, please contact support with your reference.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-12">
      <OrderSummary
        customerName={submission.name}
        styleName={submission.chosenTemplate?.name ?? ""}
        styleImageUrl={submission.chosenTemplate?.imageUrl ?? ""}
        fabricImageUrl={submission.fabricImageUrl}
        fabricLabel={submission.fabricLabel ?? ""}
        occasion={submission.occasion}
        tailorName={submission.tailor?.name ?? ""}
        yardsNeeded={submission.yardsNeeded ?? 0}
        totalPrice={submission.totalPrice ?? 0}
        reference={submission.order.paystackReference}
      />
    </main>
  );
}
