// Trusted issuer registry — frontend-only trust list.
// Not on-chain attestation. Maintained by the Stellaroid Earn team.
// v2 roadmap: migrate to signed Stellar domain TOML + on-chain attestation.

export interface IssuerInfo {
  name: string;
  category: "bootcamp" | "university" | "employer" | "dao" | "platform";
  url?: string;
}

const REGISTRY: Record<string, IssuerInfo> = {
  // Stellaroid Earn demo issuer (the account that deployed/ran the sample certs)
  // Keyed by uppercase G-address for exact match.
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
