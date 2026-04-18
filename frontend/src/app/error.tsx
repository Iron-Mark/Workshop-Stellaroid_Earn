"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[stellaroid] unhandled error:", error);
  }, [error]);

  return (
    <main
      style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "96px 24px",
        textAlign: "center",
        color: "var(--color-text)",
      }}
    >
      <img
        src="/illust-error.svg"
        alt=""
        width={224}
        height={150}
        style={{ marginBottom: 24, imageRendering: "pixelated" }}
      />
      <h1 style={{ fontSize: 40, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
        Something fell off the ledger.
      </h1>
      <p
        style={{
          color: "var(--color-text-muted)",
          fontSize: 16,
          lineHeight: 1.55,
          marginBottom: 32,
        }}
      >
        Testnet RPC or a runtime hiccup. The on-chain state is unaffected — only this
        render failed. Try again, or head back.
      </p>
      {error.digest && (
        <p
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-muted)",
            fontSize: 12,
            marginBottom: 32,
          }}
        >
          digest: {error.digest}
        </p>
      )}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={reset}
          style={{
            padding: "10px 20px",
            borderRadius: 6,
            background: "var(--color-primary)",
            color: "var(--color-on-primary)",
            border: "1px solid var(--color-primary)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            padding: "10px 20px",
            borderRadius: 6,
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
            textDecoration: "none",
          }}
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
