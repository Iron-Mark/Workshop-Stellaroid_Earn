import Link from "next/link";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main
        id="main"
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "96px 24px",
          textAlign: "center",
        }}
      >
        <img
          src="/illust/illust-404.svg"
          alt=""
          width={128}
          height={128}
          style={{ marginBottom: 24, imageRendering: "pixelated" }}
        />
        <h1
          style={{
            fontSize: 48,
            margin: "0 0 12px",
            letterSpacing: "-0.02em",
            color: "var(--color-text)",
          }}
        >
          404 ·{" "}
          <em
            style={{
              fontStyle: "normal",
              background:
                "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Not on-chain.
          </em>
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: 16,
            lineHeight: 1.55,
            marginBottom: 32,
          }}
        >
          That page doesn&rsquo;t exist. Unlike this contract, which very much does and
          keeps issuing events on Stellar testnet.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              padding: "10px 20px",
              borderRadius: 6,
              background: "var(--color-primary)",
              color: "var(--color-on-primary)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Back to home
          </Link>
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
            Open the app →
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
