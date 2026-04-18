import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui";
import "../styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://stellaroid-earn-demo.vercel.app"),
  title: {
    default: "Stellaroid Earn",
    template: "%s — Stellaroid Earn",
  },
  description:
    "Maria graduated top of her cohort in Quezon City. Her diploma is real; proving it to a Singapore employer takes 3 weeks. Stellaroid Earn binds the hash on Stellar, verifies in 5 seconds, and pays her wallet directly — no invoice, no platform, no wait.",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Stellaroid Earn",
    description:
      "Bind the hash. Pay the wallet. Prove the work. On-chain proof-of-work on Stellar — verify a credential and pay in one click.",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "Stellaroid Earn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stellaroid Earn",
    description:
      "Bind the hash. Pay the wallet. Prove the work. On-chain proof-of-work on Stellar — verify a credential and pay in one click.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
