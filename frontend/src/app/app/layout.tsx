import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App",
  description:
    "Register a certificate, verify it with an approved issuer or admin wallet, and pay the graduate, all in one Freighter-signed flow on Stellar testnet.",
  alternates: { canonical: "/app" },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
