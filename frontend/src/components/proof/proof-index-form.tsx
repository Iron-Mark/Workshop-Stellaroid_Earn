"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProofIndexFormProps {
  sampleHashes: string[];
}

export function ProofIndexForm({ sampleHashes }: ProofIndexFormProps) {
  const router = useRouter();
  const [hash, setHash] = useState("");
  const [error, setError] = useState<string | null>(null);

  const clean = hash.trim().replace(/^0x/i, "").toLowerCase();
  const valid = /^[0-9a-f]{64}$/.test(clean);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) {
      setError("Enter exactly 64 hexadecimal characters.");
      return;
    }
    router.push(`/proof/${clean}`);
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <label
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--color-text-muted)",
            marginBottom: 8,
          }}
        >
          Certificate hash
        </label>
        <input
          value={hash}
          onChange={(e) => {
            setHash(e.target.value);
            if (error) setError(null);
          }}
          placeholder="35a19276e58b8f742177892531def5e820f7c07bd8fd5a716ac710db09e6702e"
          style={{
            display: "block",
            width: "100%",
            padding: "12px 14px",
            borderRadius: 6,
            border: `1px solid ${
              hash.length === 0 || valid
                ? "var(--color-border)"
                : "var(--color-danger)"
            }`,
            background: "var(--color-bg)",
            color: "var(--color-text)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            outline: "none",
          }}
          spellCheck={false}
          autoComplete="off"
        />
        {error && (
          <p
            style={{
              color: "var(--color-danger)",
              fontSize: 13,
              margin: "6px 0 0",
            }}
          >
            {error}
          </p>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={!valid}
            style={{
              padding: "10px 20px",
              borderRadius: 6,
              background: valid ? "var(--color-primary)" : "var(--color-surface)",
              color: valid ? "var(--color-on-primary)" : "var(--color-text-muted)",
              border: `1px solid ${
                valid ? "var(--color-primary)" : "var(--color-border)"
              }`,
              fontWeight: 600,
              cursor: valid ? "pointer" : "not-allowed",
            }}
          >
            Open proof →
          </button>
          <Link
            href="/app"
            style={{
              padding: "10px 20px",
              borderRadius: 6,
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
              textDecoration: "none",
            }}
          >
            Don&rsquo;t have a hash? Try the demo
          </Link>
        </div>
      </form>

      {sampleHashes.length > 0 ? (
        <div
          style={{
            marginTop: 48,
            padding: 20,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
          }}
        >
          <h2
            style={{
              fontSize: 15,
              fontWeight: 600,
              margin: "0 0 10px",
              color: "var(--color-text)",
            }}
          >
            Try a sample
          </h2>
          <p
            style={{ color: "var(--color-text-muted)", fontSize: 13, margin: "0 0 12px" }}
          >
            Recent proof hashes emitted by the deployed contract:
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {sampleHashes.map((sampleHash) => (
              <Link
                key={sampleHash}
                href={`/proof/${sampleHash}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 36,
                  padding: "0 12px",
                  borderRadius: 999,
                  border: "1px solid var(--color-border)",
                  background: "rgba(245, 158, 11, 0.08)",
                  color: "var(--color-text)",
                  textDecoration: "none",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              >
                {sampleHash.slice(0, 12)}…{sampleHash.slice(-8)}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ProofIndexForm;
