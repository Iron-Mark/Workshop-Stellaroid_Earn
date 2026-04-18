import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stellar + Freighter Demo",
  description: "Soroban smart contract demo with Freighter wallet",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#fafafa" }}>{children}</body>
    </html>
  );
}
