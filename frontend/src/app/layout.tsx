import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stellaroid Earn",
  description: "On-chain credential registry with XLM rewards — Stellar testnet",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        style={{ margin: 0, background: "#fafafa" }}
      >
        {children}
      </body>
    </html>
  );
}
