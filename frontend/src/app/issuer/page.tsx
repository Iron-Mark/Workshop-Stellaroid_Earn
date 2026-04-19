import type { Metadata } from "next";
import {
  FreighterWalletProvider,
} from "@/hooks/use-freighter-wallet";
import { IssuerDashboard } from "@/components/issuer/issuer-dashboard";

export const metadata: Metadata = {
  title: "Issuer",
  description:
    "Inspect or register an issuer wallet in the new on-chain trust registry for Stellaroid Earn.",
};

export default function IssuerPage() {
  return (
    <FreighterWalletProvider>
      <IssuerDashboard />
    </FreighterWalletProvider>
  );
}
