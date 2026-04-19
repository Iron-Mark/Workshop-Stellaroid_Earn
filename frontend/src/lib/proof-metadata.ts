import { DEFAULT_SAMPLE_PROOF_HASH } from "@/lib/demo-data";
import type { ProofMetadata } from "@/lib/types";
import type { CertificateRecord } from "@/lib/contract-read-server";

const PROOF_METADATA: Record<string, ProofMetadata> = {
  [DEFAULT_SAMPLE_PROOF_HASH.toLowerCase()]: {
    title: "Stellar Smart Contract Bootcamp Completion",
    description:
      "Awarded after shipping a working Soroban contract, deploying it to Stellar testnet, and demoing the full register, verify, and pay flow through Freighter.",
    cohort: "Stellar PH Bootcamp 2026",
    criteria:
      "Complete the assigned Soroban contract, pass the test suite, deploy to Stellar testnet, connect the dApp to Freighter, and present an end-to-end proof block demo.",
    skills: [
      "Soroban smart contracts",
      "Stellar testnet deployment",
      "Freighter wallet integration",
      "Next.js dApp frontend",
      "On-chain credential verification",
    ],
    evidence: [
      {
        label: "About the demo",
        href: "/about",
      },
      {
        label: "Launch the app flow",
        href: "/app",
      },
      {
        label: "Bootcamp contract proof block",
        href: "https://stellar.expert/explorer/testnet/contract/CDWCARXLJUJ5ISC3GPXRLR5HC6QPLMGULCVRIACYKQM4U5AG7TFWXHVZ",
      },
    ],
  },
};

export function getProofMetadata(hash: string): ProofMetadata | null {
  const key = hash.trim().toLowerCase();
  return PROOF_METADATA[key] ?? null;
}

// Only fetch from https:// URIs — prevents SSRF via file://, http://localhost, etc.
function isSafeUri(uri: string): boolean {
  try {
    const url = new URL(uri.trim());
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseMetadataJson(json: unknown): ProofMetadata | null {
  if (!json || typeof json !== "object") return null;
  const obj = json as Record<string, unknown>;
  const title = typeof obj.title === "string" ? obj.title.trim() : "";
  if (!title) return null;
  return {
    title,
    description: typeof obj.description === "string" ? obj.description : "",
    cohort: typeof obj.cohort === "string" ? obj.cohort : undefined,
    criteria: typeof obj.criteria === "string" ? obj.criteria : undefined,
    skills: Array.isArray(obj.skills)
      ? obj.skills.filter((s): s is string => typeof s === "string")
      : [],
    evidence: Array.isArray(obj.evidence)
      ? obj.evidence.filter(
          (e): e is { label: string; href: string } =>
            typeof e === "object" &&
            e !== null &&
            typeof (e as Record<string, unknown>).label === "string" &&
            typeof (e as Record<string, unknown>).href === "string",
        )
      : [],
  };
}

async function fetchMetadataFromUri(uri: string): Promise<ProofMetadata | null> {
  try {
    const res = await fetch(uri, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return parseMetadataJson(await res.json());
  } catch {
    return null;
  }
}

export async function getProofMetadataForCertificate(
  hash: string,
  cert: Pick<CertificateRecord, "title" | "cohort" | "metadataUri"> | null,
): Promise<ProofMetadata | null> {
  const fallback = getProofMetadata(hash);

  if (!cert) return fallback;

  const uri = cert.metadataUri.trim();

  // Prefer live metadata fetched from the on-chain URI.
  if (uri && isSafeUri(uri)) {
    const remote = await fetchMetadataFromUri(uri);
    if (remote) return remote;
  }

  // Fall back: merge on-chain fields with the hardcoded demo map.
  const contractEvidence = uri ? [{ label: "Metadata source", href: uri }] : [];
  const title = cert.title.trim() || fallback?.title;
  const description = fallback?.description;

  if (!title && !description && !fallback && contractEvidence.length === 0) {
    return null;
  }

  return {
    title: title ?? "On-chain credential",
    description:
      description ??
      "This credential is anchored on Stellar and carries contract-backed title, issuer, and status data.",
    cohort: cert.cohort.trim() || fallback?.cohort,
    criteria: fallback?.criteria,
    skills: fallback?.skills ?? [],
    evidence: [...contractEvidence, ...(fallback?.evidence ?? [])],
  };
}
