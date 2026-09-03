"use client";

interface Props {
  customerName: string;
  styleName: string;
  styleImageUrl: string;
  fabricImageUrl: string;
  fabricLabel: string;
  occasion: string;
  tailorName: string;
  yardsNeeded: number;
  totalPrice: number;
  reference: string;
}

export default function OrderSummary({
  customerName,
  styleName,
  styleImageUrl,
  fabricImageUrl,
  fabricLabel,
  occasion,
  tailorName,
  yardsNeeded,
  totalPrice,
  reference,
}: Props) {
  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8 print:hidden">
        <h1 className="text-2xl font-semibold text-green-700">Payment confirmed</h1>
        <p className="text-stone-500 mt-2">
          We&apos;ve notified your tailor. Here&apos;s your order summary.
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="mt-4 rounded-full px-6 py-2.5 text-sm font-medium border border-stone-300"
        >
          Save / print summary
        </button>
      </div>

      <div className="rounded-xl border border-stone-200 p-6" id="order-summary">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <p className="text-xs text-stone-400 mt-1">Reference: {reference}</p>

        <div className="mt-4 flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fabricImageUrl}
            alt="Your fabric"
            className="w-20 h-20 object-cover rounded-lg border border-stone-200"
          />
          {styleImageUrl && styleImageUrl !== "PENDING_UPLOAD" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={styleImageUrl}
              alt={styleName}
              className="w-20 h-20 object-cover rounded-lg border border-stone-200"
            />
          )}
        </div>

        <dl className="mt-4 divide-y divide-stone-200 text-sm">
          <Row label="Customer" value={customerName} />
          <Row label="Fabric" value={fabricLabel} />
          <Row label="Occasion" value={occasion} />
          <Row label="Style" value={styleName} />
          <Row label="Tailor" value={tailorName} />
          <Row label="Yards" value={`${yardsNeeded}`} />
          <Row label="Amount paid" value={`₦${totalPrice.toLocaleString()}`} />
        </dl>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2 flex justify-between gap-4">
      <dt className="text-stone-500">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
