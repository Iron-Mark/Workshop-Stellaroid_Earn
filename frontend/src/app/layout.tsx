import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Orbitron, Exo_2, JetBrains_Mono, Share_Tech_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ToastProvider } from "@/components/ui";
import { JsonLd } from "@/components/ui/json-ld";
import "../styles/globals.css";
import { cn } from "@/lib/utils";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pixel",
  display: "swap",
});

const BASE_URL = "https://stellaroid-earn-demo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Stellaroid Earn",
    template: "%s — Stellaroid Earn",
  },
  description:
    "Stellaroid Earn links proof and payment on Stellar so teams can check the record and pay with confidence.",
  alternates: { canonical: BASE_URL },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Stellaroid Earn",
    description: "Check the record and pay with confidence on Stellar.",
    locale: "en_US",
    alternateLocale: "tl_PH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stellaroid Earn",
    description: "Check the record and pay with confidence on Stellar.",
  },
};

const webAppJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Stellaroid Earn",
    url: BASE_URL,
    description:
      "Stellaroid Earn links proof and payment on Stellar for certificates, completed work, and milestone approvals.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Stellaroid Earn",
    url: BASE_URL,
  },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("stellaroid:locale")?.value === "tl" ? "tl" : "en";

  return (
    <html
      lang={lang}
      className={cn(orbitron.variable, exo2.variable, jetbrainsMono.variable, shareTechMono.variable, "font-sans")}
    >
      <body suppressHydrationWarning>
        {webAppJsonLd.map((schema, i) => (
          <JsonLd key={i} data={schema} />
        ))}
        {children}
        <Analytics />
        <ToastProvider />
      </body>
    </html>
  );
}
