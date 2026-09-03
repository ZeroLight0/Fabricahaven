import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
      <h1 className="text-4xl font-semibold tracking-tight">Fabrica</h1>
      <p className="max-w-md text-stone-600">
        Upload a photo of fabric you own, tell us the occasion and your
        measurements, and we&apos;ll suggest the 5 best-fitting styles —
        then connect you with a tailor to make it.
      </p>
      <Link
        href="/submit"
        className="rounded-full bg-stone-900 text-white px-8 py-3 font-medium hover:bg-stone-700 transition-colors"
      >
        Start with your fabric
      </Link>
    </main>
  );
}
