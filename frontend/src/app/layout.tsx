import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { ToastProvider } from "@/components/ui";
import "../styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://stellaroid-earn-demo.vercel.app"),
  title: {
    default: "Stellaroid Earn",
    template: "%s — Stellaroid Earn",
  },
  description:
    "Verify the credential. Pay the graduate. Stellaroid Earn anchors certificate hashes on Stellar, verifies them in seconds, and settles payment directly to the student wallet.",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Stellaroid Earn",
    description:
      "Verify the credential. Pay the graduate. On-chain proof and direct settlement on Stellar.",
    // Dynamic PNG rendered by src/app/opengraph-image.tsx — renders reliably on
    // Facebook, iMessage, WhatsApp, Telegram, LinkedIn, X, Slack, Discord.
  },
  twitter: {
    card: "summary_large_image",
    title: "Stellaroid Earn",
    description:
      "Verify the credential. Pay the graduate. On-chain proof and direct settlement on Stellar.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ToastProvider>
          {children}
          <Analytics />
        </ToastProvider>
      </body>
    </html>
  );
}
