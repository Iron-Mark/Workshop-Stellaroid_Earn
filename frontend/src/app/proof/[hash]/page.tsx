// Server component — no "use client"
// force-dynamic: getCertificate calls the RPC at request time; no static pre-render.
export const dynamic = "force-dynamic";

import { getCertificate, CertificateRecord } from "@/lib/contract-client";
import { ProofCard } from "@/components/proof/proof-card";

interface PageProps {
  params: Promise<{ hash: string }>;
}

export default async function ProofPage({ params }: PageProps) {
  const { hash } = await params;

  let cert: CertificateRecord | null = null;
  try {
    cert = await getCertificate(hash);
  } catch {
    // RPC failure or missing config — treat as "not found" rather than hard error.
    cert = null;
  }

  return <ProofCard hash={hash} cert={cert} />;
}
