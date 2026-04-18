import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Stellaroid Earn — Proof Block";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ hash: string }>;
}

function shortHash(hash: string) {
  if (hash.length <= 16) return hash;
  return `${hash.slice(0, 10)}…${hash.slice(-10)}`;
}

export default async function OpengraphImage({ params }: Props) {
  const { hash } = await params;
  const display = shortHash(hash);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #312E81 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
          color: "#F8FAFC",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "28px",
            fontWeight: 600,
            color: "#F59E0B",
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#F59E0B",
              alignItems: "center",
              justifyContent: "center",
              color: "#0F172A",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            ✓
          </div>
          STELLAROID EARN
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "48px",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              color: "#94A3B8",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 500,
            }}
          >
            Verified Proof of Work
          </div>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#F8FAFC",
            }}
          >
            Work completed.
            <br />
            Payment settled.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              color: "#8B5CF6",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontWeight: 600,
            }}
          >
            SHA-256 · Anchored on Stellar
          </div>
          <div
            style={{
              fontSize: "40px",
              fontFamily: "monospace",
              color: "#F8FAFC",
              background: "rgba(148, 163, 184, 0.1)",
              borderRadius: "16px",
              padding: "20px 28px",
              border: "1px solid rgba(148, 163, 184, 0.25)",
              width: "fit-content",
            }}
          >
            {display}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: "72px",
            right: "72px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "18px",
            color: "#10B981",
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            borderRadius: "999px",
            padding: "10px 20px",
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "10px",
              height: "10px",
              borderRadius: "999px",
              background: "#10B981",
            }}
          />
          ON-CHAIN · TESTNET
        </div>
      </div>
    ),
    { ...size },
  );
}
