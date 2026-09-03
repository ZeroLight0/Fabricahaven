import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo-transparent.png";

export default function SiteHeader() {
  return (
    <header className="border-b border-taupe/25 bg-cream/90 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-sm"
          aria-label="Fabrica home"
        >
          <Image
            src={logo}
            alt=""
            width={34}
            height={34}
            className="rounded-md"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-tight text-espresso">
            Fabrica
          </span>
        </Link>
      </div>
    </header>
  );
}
