import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo-transparent.png";

export default function SiteHeader() {
  return (
    <header className="border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src={logo}
            alt="Fabrica"
            width={32}
            height={32}
            className="rounded-md"
            priority
          />
          <span className="font-semibold tracking-tight text-stone-900">Fabrica</span>
        </Link>
      </div>
    </header>
  );
}
