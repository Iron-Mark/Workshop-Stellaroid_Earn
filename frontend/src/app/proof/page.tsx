import type { Metadata } from "next";
import { SiteNav } from "@/components/layout/site-nav";

export const metadata: Metadata = {
  title: "Look Up a Certificate",
  description:
    "Paste a SHA-256 hash to view its on-chain record, issuer trust status, and any attached credential evidence. No wallet required.",
  alternates: { canonical: "/proof" },
};
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/ui/json-ld";
import { ProofIndexForm } from "@/components/proof/proof-index-form";
import { DEFAULT_SAMPLE_PROOF_HASH } from "@/lib/demo-data";
import { getRecentProofHashes } from "@/lib/events";
import { appConfig } from "@/lib/config";

export default async function ProofIndex() {
  let sampleHashes = [DEFAULT_SAMPLE_PROOF_HASH];

  try {
    const recentHashes = await getRecentProofHashes(appConfig.contractId, 3);
    if (recentHashes.length > 0) {
      sampleHashes = recentHashes;
    }
  } catch {
    // Fall back to the known-good sample hash if the RPC is unavailable.
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Look Up a Certificate",
          url: "https://stellaroid-earn-demo.vercel.app/proof",
          description:
            "Paste a SHA-256 hash to view its on-chain record, issuer trust status, and any attached credential evidence.",
          isPartOf: {
            "@type": "WebApplication",
            name: "Stellaroid Earn",
            url: "https://stellaroid-earn-demo.vercel.app",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://stellaroid-earn-demo.vercel.app",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Look Up a Certificate",
              item: "https://stellaroid-earn-demo.vercel.app/proof",
            },
          ],
        }}
      />
      <SiteNav />
      <main
        id="main"
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "72px 24px",
          color: "var(--color-text)",
          textAlign: "center",
        }}
      >
        <img
          src="/illust/illust-lookup.svg"
          alt=""
          width={192}
          height={128}
          style={{ marginBottom: 20, imageRendering: "pixelated" }}
        />
        <span
          style={{
            display: "inline-block",
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-primary)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            background: "rgba(245, 158, 11, 0.08)",
            padding: "4px 12px",
            borderRadius: 999,
            marginBottom: 16,
          }}
        >
          Public proof
        </span>
        <h1 style={{ fontSize: 40, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
          Look up any certificate
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: 16,
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          Paste a 64-character SHA-256 hash to view its on-chain record, issuer
          trust status, and any attached credential evidence. No wallet
          required.
        </p>
        <ProofIndexForm sampleHashes={sampleHashes} />
      </main>
      <SiteFooter />
    </>
  );
}
