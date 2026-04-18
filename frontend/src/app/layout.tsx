import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Stellaroid Earn",
  description: "On-chain credential registry on Stellar testnet.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
