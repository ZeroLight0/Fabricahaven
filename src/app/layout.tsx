import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.APP_URL ?? "http://localhost:3000";
const siteName = "Fabrica";
const description =
  "Upload a photo of fabric you own and Fabrica's AI suggests the 5 best-fitting clothing styles for your occasion, calculates yardage and price, and connects you with a tailor to get it made.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fabrica — AI Style Suggestions for Your Fabric",
    template: "%s — Fabrica",
  },
  description,
  keywords: [
    "tailoring",
    "fabric to fashion",
    "AI style suggestions",
    "Nigerian tailors",
    "custom clothing",
    "aso ebi",
    "native wear styles",
    "fashion yardage calculator",
  ],
  authors: [{ name: "Fabrica" }],
  applicationName: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: "Fabrica — AI Style Suggestions for Your Fabric",
    description,
    locale: "en_NG",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Fabrica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fabrica — AI Style Suggestions for Your Fabric",
    description,
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteName,
  url: siteUrl,
  description,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  image: `${siteUrl}/logo-512.png`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="theme-color" content="#F7EFE7" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${poppins.variable} min-h-full flex flex-col bg-cream text-espresso font-sans antialiased`}
      >
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
