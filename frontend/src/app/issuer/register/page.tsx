import type { Metadata } from "next";
import { FreighterWalletProvider } from "@/hooks/use-freighter-wallet";
import { RegisterIssuerExperience } from "./register-experience";

export const metadata: Metadata = {
  title: "Register Issuer",
  description:
    "Create an on-chain issuer profile for the Phase 1 trust registry in Stellaroid Earn.",
};

export default function RegisterIssuerPage() {
  return (
    <FreighterWalletProvider>
      <RegisterIssuerExperience />
    </FreighterWalletProvider>
  );
}
