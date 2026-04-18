// Compact, iframe-friendly Proof Block for embedding in portfolios, Notion, blogs.
// Usage: <iframe src="https://.../proof/<hash>/embed" width="420" height="220" />
export const revalidate = 60;

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getCertificateServer,
  CertificateRecord,
  getIssuerServer,
} from "@/lib/contract-read-server";
import { appConfig } from "@/lib/config";
import { shortenAddress } from "@/lib/format";
import { getProofMetadataForCertificate } from "@/lib/proof-metadata";
import type { IssuerRecord } from "@/lib/types";

const HASH_RE = /^[0-9a-f]{64}$/i;

interface PageProps {
  params: Promise<{ hash: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { hash } = await params;
  const short =
    hash.length > 16 ? `${hash.slice(0, 8)}…${hash.slice(-8)}` : hash;
  return {
    title: `Proof ${short} — embed`,
    robots: { index: false, follow: false },
  };
}

export default async function EmbedProof({ params }: PageProps) {
  const { hash } = await params;

  if (!HASH_RE.test(hash)) notFound();

  let cert: CertificateRecord | null = null;
  let issuer: IssuerRecord | null = null;
  try {
    cert = await getCertificateServer(hash);
  } catch {
    cert = null;
  }

  if (cert) {
    try {
      issuer = await getIssuerServer(cert.issuer);
    } catch {
      issuer = null;
    }
  }

  const proofMetadata = getProofMetadataForCertificate(hash, cert);

  const status =
    cert?.status === "verified"
      ? "Verified"
      : cert?.status === "revoked"
        ? "Revoked"
        : cert?.status === "suspended"
          ? "Suspended"
          : cert?.status === "expired"
            ? "Expired"
            : cert?.status === "issued"
              ? "Issued"
              : cert
                ? "Unknown"
                : "Not found";
  const statusColor =
    cert?.status === "verified"
      ? "#10B981"
      : cert?.status === "revoked"
        ? "#EF4444"
        : cert?.status === "suspended" || cert?.status === "expired"
          ? "#F59E0B"
          : cert
            ? "#8B5CF6"
            : "#64748B";
  const short =
    hash.length > 20 ? `${hash.slice(0, 10)}…${hash.slice(-10)}` : hash;
  const proofUrl = `/proof/${hash}`;
  const explorerUrl = appConfig.contractId
    ? `${appConfig.explorerUrl}/contract/${appConfig.contractId}`
    : appConfig.explorerUrl;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "220px",
        padding: "20px",
        fontFamily:
          "'IBM Plex Sans', system-ui, -apple-system, Segoe UI, sans-serif",
        background:
          "linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #312E81 100%)",
        color: "#F8FAFC",
        borderRadius: "16px",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            background: "#F59E0B",
            color: "#0F172A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "16px",
          }}
        >
          ✓
        </div>
        <span
          style={{
            fontWeight: 700,
            letterSpacing: "-0.01em",
            fontSize: "14px",
          }}
        >
          STELLAROID EARN
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "11px",
            fontWeight: 600,
            color: statusColor,
            background: `${statusColor}22`,
            border: `1px solid ${statusColor}55`,
            borderRadius: "999px",
            padding: "4px 10px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {status}
        </span>
      </div>

      <div style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.4 }}>
        {proofMetadata?.title
          ? `${proofMetadata.title} — on-chain credential anchored on Stellar.`
          : "On-chain proof of work — SHA-256 anchored on Stellar."}
      </div>

      {proofMetadata?.cohort ? (
        <div style={{ fontSize: "12px", color: "#C4B5FD", fontWeight: 600 }}>
          {proofMetadata.cohort}
        </div>
      ) : null}

      <code
        style={{
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
          fontSize: "13px",
          color: "#F8FAFC",
          background: "rgba(148, 163, 184, 0.1)",
          border: "1px solid rgba(148, 163, 184, 0.25)",
          borderRadius: "8px",
          padding: "10px 14px",
          wordBreak: "break-all",
        }}
      >
        {short}
      </code>

      {cert && (
        <div style={{ fontSize: "12px", color: "#94A3B8" }}>
          Issuer{" "}
          {issuer?.name
            ? `${issuer.name} (${shortenAddress(cert.issuer, 6)})`
            : shortenAddress(cert.issuer, 6)}{" "}
          · Owner {shortenAddress(cert.owner, 6)}
        </div>
      )}

      {proofMetadata?.skills.length ? (
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            fontSize: "11px",
          }}
        >
          {proofMetadata.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              style={{
                padding: "4px 8px",
                borderRadius: "999px",
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.24)",
                color: "#FCD34D",
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          gap: "16px",
          fontSize: "12px",
          marginTop: "auto",
          paddingTop: "4px",
        }}
      >
        <Link
          href={proofUrl}
          target="_top"
          style={{ color: "#F59E0B", textDecoration: "none", fontWeight: 600 }}
        >
          View full Proof Block ↗
        </Link>
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#8B5CF6", textDecoration: "none" }}
        >
          stellar.expert ↗
        </a>
      </div>
    </div>
  );
}
