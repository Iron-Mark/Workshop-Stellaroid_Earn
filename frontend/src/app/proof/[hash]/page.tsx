// Server component — no "use client"
// force-dynamic: getCertificate calls the RPC at request time; no static pre-render.
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import {
  getCertificateServer,
  CertificateRecord,
} from "@/lib/contract-read-server";
import { ProofCard } from "@/components/proof/proof-card";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

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

  let cert: CertificateRecord | null = null;
  let lookupFailed = false;
  try {
    cert = await getCertificateServer(hash);
  } catch {
    // Distinguish technical lookup failure from a true on-chain "not found" result.
    lookupFailed = true;
    cert = null;
  }

  return (
    <>
      <SiteNav />
      <main
        id="main"
        style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}
      >
        <ProofCard hash={hash} cert={cert} lookupFailed={lookupFailed} />
      </main>
      <SiteFooter />
    </>
  );
}
