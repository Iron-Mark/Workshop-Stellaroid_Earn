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
    "On-chain credential registry on Stellar testnet. Issuer registers a cert hash, employer verifies and pays the grad in XLM — all via Freighter.",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Stellaroid Earn",
    description:
      "On-chain credential registry on Stellar testnet — verify a cert, pay the grad in XLM in one click.",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "Stellaroid Earn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stellaroid Earn",
    description:
      "On-chain credential registry on Stellar testnet — verify a cert, pay the grad in XLM in one click.",
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
