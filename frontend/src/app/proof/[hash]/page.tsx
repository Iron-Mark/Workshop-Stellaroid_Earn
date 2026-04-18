// Server component — no "use client"
// Cache each proof page for 60 s (stale-while-revalidate).
// One RPC call per unique hash per minute regardless of traffic volume.
export const revalidate = 60;

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCertificateServer,
  CertificateRecord,
  getIssuerServer,
} from "@/lib/contract-read-server";
import { getProofMetadataForCertificate } from "@/lib/proof-metadata";
import type { IssuerRecord } from "@/lib/types";
import { ProofCard } from "@/components/proof/proof-card";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/ui/json-ld";

// Accept only well-formed SHA-256 hex strings — anything else gets an instant
// 404 with no RPC call, protecting against hash-enumeration flooding.
const HASH_RE = /^[0-9a-f]{64}$/i;

const BASE_URL = "https://stellaroid-earn-demo.vercel.app";

interface PageProps {
  params: Promise<{ hash: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { hash } = await params;
  const short =
    hash.length > 16 ? `${hash.slice(0, 10)}…${hash.slice(-10)}` : hash;
  const title = `Proof of Work · ${short} — Stellaroid Earn`;
  const description =
    "Verified, on-chain proof of completed work. Anchored on Stellar with SHA-256. Paid atomically on verification.";

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/proof/${hash}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProofPage({ params }: PageProps) {
  const { hash } = await params;

  if (!HASH_RE.test(hash)) notFound();

  const short =
    hash.length > 16 ? `${hash.slice(0, 10)}…${hash.slice(-10)}` : hash;
  let cert: CertificateRecord | null = null;
  let issuer: IssuerRecord | null = null;
  let lookupFailed = false;
  let issuerLookupFailed = false;
  try {
    cert = await getCertificateServer(hash);
  } catch {
    // Distinguish technical lookup failure from a true on-chain "not found" result.
    lookupFailed = true;
    cert = null;
  }

  if (cert) {
    try {
      issuer = await getIssuerServer(cert.issuer);
    } catch {
      issuerLookupFailed = true;
      issuer = null;
    }
  }

  const proofMetadata = getProofMetadataForCertificate(hash, cert);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "DigitalDocument",
          name: proofMetadata?.title ?? `Proof of Work · ${short}`,
          description:
            proofMetadata?.description ??
            "Verified, on-chain proof of completed work. Anchored on Stellar with SHA-256. Paid atomically on verification.",
          identifier: hash,
          url: `${BASE_URL}/proof/${hash}`,
          keywords: proofMetadata?.skills,
        }}
      />
      <SiteNav />
      <main
        id="main"
        style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}
      >
        <ProofCard
          hash={hash}
          cert={cert}
          issuer={issuer}
          proofMetadata={proofMetadata}
          lookupFailed={lookupFailed}
          issuerLookupFailed={issuerLookupFailed}
        />
      </main>
      <SiteFooter />
    </>
  );
}
