import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 relative flex flex-col items-center justify-center px-6 py-20 text-center gap-6 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_35%,rgba(235,203,196,0.55),transparent)]"
      />

      <p className="text-xs font-medium tracking-[0.2em] text-dusty-rose uppercase">
        Design · Stitch · Elevate
      </p>

      <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight max-w-lg text-balance">
        AI style suggestions for the fabric you already own
      </h1>

      <p className="max-w-md text-espresso-muted text-balance">
        Upload a photo of fabric you own, tell us the occasion and your
        measurements, and we&apos;ll suggest the 5 best-fitting styles —
        then connect you with a tailor to make it.
      </p>

      <Link
        href="/submit"
        className="satin-sheen overflow-hidden rounded-full bg-espresso text-cream px-8 py-3 font-medium hover:bg-espresso/90 transition-colors"
      >
        Start with your fabric
      </Link>
    </main>
  );
}
