import { DEFAULT_SAMPLE_PROOF_HASH } from "@/lib/demo-data";
import type { ProofMetadata } from "@/lib/types";
import type { CertificateRecord } from "@/lib/contract-read-server";

const PROOF_METADATA: Record<string, ProofMetadata> = {
  [DEFAULT_SAMPLE_PROOF_HASH.toLowerCase()]: {
    title: "Stellar Smart Contract Bootcamp Completion",
    description:
      "Awarded after shipping a working Soroban contract, deploying it to Stellar testnet, and demoing the full register, verify, and pay flow through Freighter.",
    cohort: "Stellar Philippines UniTour 2026",
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

export function getProofMetadataForCertificate(
  hash: string,
  cert: Pick<CertificateRecord, "title" | "cohort" | "metadataUri"> | null,
): ProofMetadata | null {
  const fallback = getProofMetadata(hash);

  if (!cert) {
    return fallback;
  }

  const contractEvidence =
    cert.metadataUri.trim() !== ""
      ? [
          {
            label: "Metadata source",
            href: cert.metadataUri.trim(),
          },
        ]
      : [];

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
