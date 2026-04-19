// Trusted issuer registry — frontend-only trust list.
// Not on-chain attestation. Maintained by the Stellaroid Earn team.
// v2 roadmap: migrate to signed Stellar domain TOML + on-chain attestation.

export interface IssuerInfo {
  name: string;
  category: "bootcamp" | "university" | "employer" | "dao" | "platform";
  url?: string;
}

const REGISTRY: Record<string, IssuerInfo> = {
  // Stellaroid Earn demo issuer — admin account that deployed the contract
  // and registered the sample certificates showcased on the landing page.
  // Keyed by uppercase G-address for exact match.
  GAWIOVGFSPJDEIJJZUSVRFPVP3D5VNO2LGCU47KEHJD6MV277QKNR34D: {
    name: "Stellar Philippines UniTour",
    category: "bootcamp",
    url: "https://stellaroid-earn-demo.vercel.app",
  },
  // Add production issuers here as partnerships land.
};

export function lookupIssuer(address: string | undefined): IssuerInfo | null {
  if (!address) return null;
  const key = address.trim().toUpperCase();
  return REGISTRY[key] ?? null;
}

export function isTrustedIssuer(address: string | undefined): boolean {
  return lookupIssuer(address) !== null;
}
