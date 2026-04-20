import { ImageResponse } from "next/og";

export const alt =
  "Stellaroid Earn: Bind the hash. Pay the wallet. Prove the work.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#0F172A",
        padding: "72px 80px",
        fontFamily: "sans-serif",
        color: "#F8FAFC",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Amber glow orb — top left */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          left: "-80px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.18) 0%, rgba(245,158,11,0.06) 40%, transparent 70%)",
          display: "flex",
        }}
      />
      {/* Violet glow orb — bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: "-140px",
          right: "-100px",
          width: "460px",
          height: "460px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
          display: "flex",
        }}
      />
      {/* Subtle center glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "600px",
          height: "400px",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 60%)",
          display: "flex",
        }}
      />

      {/* Network node graph overlay */}
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Edges */}
        <line
          x1="100"
          y1="100"
          x2="300"
          y2="180"
          stroke="rgba(245,158,11,0.1)"
          strokeWidth="1"
        />
        <line
          x1="300"
          y1="180"
          x2="520"
          y2="90"
          stroke="rgba(245,158,11,0.09)"
          strokeWidth="1"
        />
        <line
          x1="520"
          y1="90"
          x2="740"
          y2="160"
          stroke="rgba(245,158,11,0.08)"
          strokeWidth="1"
        />
        <line
          x1="740"
          y1="160"
          x2="950"
          y2="100"
          stroke="rgba(245,158,11,0.07)"
          strokeWidth="1"
        />
        <line
          x1="950"
          y1="100"
          x2="1120"
          y2="140"
          stroke="rgba(245,158,11,0.06)"
          strokeWidth="1"
        />
        <line
          x1="300"
          y1="180"
          x2="200"
          y2="340"
          stroke="rgba(245,158,11,0.07)"
          strokeWidth="1"
        />
        <line
          x1="740"
          y1="160"
          x2="880"
          y2="350"
          stroke="rgba(139,92,246,0.08)"
          strokeWidth="1"
        />
        <line
          x1="880"
          y1="350"
          x2="1060"
          y2="420"
          stroke="rgba(139,92,246,0.06)"
          strokeWidth="1"
        />
        <line
          x1="200"
          y1="340"
          x2="400"
          y2="480"
          stroke="rgba(245,158,11,0.06)"
          strokeWidth="1"
        />
        <line
          x1="880"
          y1="350"
          x2="740"
          y2="500"
          stroke="rgba(139,92,246,0.06)"
          strokeWidth="1"
        />

        {/* Glow halos */}
        <circle
          cx="300"
          cy="180"
          r="16"
          fill="rgba(245,158,11,0.06)"
        />
        <circle
          cx="740"
          cy="160"
          r="14"
          fill="rgba(245,158,11,0.05)"
        />
        <circle
          cx="880"
          cy="350"
          r="12"
          fill="rgba(139,92,246,0.06)"
        />

        {/* Static nodes */}
        <circle
          cx="100"
          cy="100"
          r="3"
          fill="rgba(245,158,11,0.3)"
        />
        <circle
          cx="520"
          cy="90"
          r="3.5"
          fill="rgba(245,158,11,0.3)"
        />
        <circle
          cx="950"
          cy="100"
          r="3"
          fill="rgba(245,158,11,0.25)"
        />
        <circle
          cx="1120"
          cy="140"
          r="2.5"
          fill="rgba(245,158,11,0.2)"
        />
        <circle
          cx="200"
          cy="340"
          r="3"
          fill="rgba(245,158,11,0.25)"
        />
        <circle
          cx="400"
          cy="480"
          r="2.5"
          fill="rgba(245,158,11,0.2)"
        />
        <circle
          cx="1060"
          cy="420"
          r="2.5"
          fill="rgba(139,92,246,0.22)"
        />
        <circle
          cx="740"
          cy="500"
          r="2.5"
          fill="rgba(139,92,246,0.2)"
        />

        {/* Key nodes */}
        <circle
          cx="300"
          cy="180"
          r="5"
          fill="rgba(245,158,11,0.5)"
        />
        <circle
          cx="740"
          cy="160"
          r="4.5"
          fill="rgba(245,158,11,0.45)"
        />
        <circle
          cx="880"
          cy="350"
          r="4"
          fill="rgba(139,92,246,0.45)"
        />
      </svg>

      {/* Top bar: logo + badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Pixel coin logo */}
          <div
            style={{
              display: "flex",
              width: "52px",
              height: "52px",
            }}
          >
            <svg
              viewBox="0 0 64 64"
              width="52"
              height="52"
              style={{ imageRendering: "pixelated" }}
            >
              {/* Coin body — simplified pixel S */}
              {/* Row 1 */}
              <rect x="20" y="4" width="24" height="4" fill="#78350F" />
              {/* Row 2 */}
              <rect x="12" y="8" width="8" height="4" fill="#78350F" />
              <rect x="20" y="8" width="24" height="4" fill="#B45309" />
              <rect x="44" y="8" width="8" height="4" fill="#78350F" />
              {/* Row 3 */}
              <rect x="8" y="12" width="4" height="4" fill="#78350F" />
              <rect x="12" y="12" width="4" height="4" fill="#B45309" />
              <rect x="16" y="12" width="12" height="4" fill="#FBBF24" />
              <rect x="28" y="12" width="4" height="4" fill="#FEF3C7" />
              <rect x="32" y="12" width="16" height="4" fill="#FBBF24" />
              <rect x="48" y="12" width="4" height="4" fill="#B45309" />
              <rect x="52" y="12" width="4" height="4" fill="#78350F" />
              {/* Rows 4-6 — S top + left stem */}
              <rect x="8" y="16" width="4" height="4" fill="#78350F" />
              <rect x="12" y="16" width="4" height="4" fill="#B45309" />
              <rect x="16" y="16" width="4" height="4" fill="#FBBF24" />
              <rect x="20" y="16" width="20" height="4" fill="#78350F" />
              <rect x="40" y="16" width="8" height="4" fill="#FBBF24" />
              <rect x="48" y="16" width="4" height="4" fill="#B45309" />
              <rect x="52" y="16" width="4" height="4" fill="#78350F" />
              {/* Row 5 */}
              <rect x="4" y="20" width="4" height="4" fill="#78350F" />
              <rect x="8" y="20" width="4" height="4" fill="#B45309" />
              <rect x="12" y="20" width="8" height="4" fill="#FBBF24" />
              <rect x="20" y="20" width="4" height="4" fill="#78350F" />
              <rect x="24" y="20" width="24" height="4" fill="#FBBF24" />
              <rect x="48" y="20" width="8" height="4" fill="#B45309" />
              <rect x="56" y="20" width="4" height="4" fill="#78350F" />
              {/* Row 6 */}
              <rect x="4" y="24" width="4" height="4" fill="#78350F" />
              <rect x="8" y="24" width="4" height="4" fill="#B45309" />
              <rect x="12" y="24" width="8" height="4" fill="#FBBF24" />
              <rect x="20" y="24" width="4" height="4" fill="#78350F" />
              <rect x="24" y="24" width="24" height="4" fill="#FBBF24" />
              <rect x="48" y="24" width="8" height="4" fill="#B45309" />
              <rect x="56" y="24" width="4" height="4" fill="#78350F" />
              {/* Row 7 — S middle */}
              <rect x="4" y="28" width="4" height="4" fill="#78350F" />
              <rect x="8" y="28" width="4" height="4" fill="#B45309" />
              <rect x="12" y="28" width="8" height="4" fill="#FBBF24" />
              <rect x="20" y="28" width="20" height="4" fill="#78350F" />
              <rect x="40" y="28" width="8" height="4" fill="#FBBF24" />
              <rect x="48" y="28" width="8" height="4" fill="#B45309" />
              <rect x="56" y="28" width="4" height="4" fill="#78350F" />
              {/* Row 8-9 — S right stem */}
              <rect x="4" y="32" width="4" height="4" fill="#78350F" />
              <rect x="8" y="32" width="4" height="4" fill="#B45309" />
              <rect x="12" y="32" width="24" height="4" fill="#FBBF24" />
              <rect x="36" y="32" width="4" height="4" fill="#78350F" />
              <rect x="40" y="32" width="8" height="4" fill="#FBBF24" />
              <rect x="48" y="32" width="8" height="4" fill="#B45309" />
              <rect x="56" y="32" width="4" height="4" fill="#78350F" />
              {/* Row 9 */}
              <rect x="4" y="36" width="4" height="4" fill="#78350F" />
              <rect x="8" y="36" width="4" height="4" fill="#B45309" />
              <rect x="12" y="36" width="24" height="4" fill="#FBBF24" />
              <rect x="36" y="36" width="4" height="4" fill="#78350F" />
              <rect x="40" y="36" width="8" height="4" fill="#FBBF24" />
              <rect x="48" y="36" width="8" height="4" fill="#B45309" />
              <rect x="56" y="36" width="4" height="4" fill="#78350F" />
              {/* Row 10 — S bottom bar */}
              <rect x="8" y="40" width="4" height="4" fill="#78350F" />
              <rect x="12" y="40" width="4" height="4" fill="#B45309" />
              <rect x="16" y="40" width="4" height="4" fill="#FBBF24" />
              <rect x="20" y="40" width="20" height="4" fill="#78350F" />
              <rect x="40" y="40" width="8" height="4" fill="#FBBF24" />
              <rect x="48" y="40" width="8" height="4" fill="#B45309" />
              <rect x="56" y="40" width="4" height="4" fill="#78350F" />
              {/* Row 11 */}
              <rect x="8" y="44" width="4" height="4" fill="#78350F" />
              <rect x="12" y="44" width="4" height="4" fill="#B45309" />
              <rect x="16" y="44" width="32" height="4" fill="#FBBF24" />
              <rect x="48" y="44" width="4" height="4" fill="#B45309" />
              <rect x="52" y="44" width="4" height="4" fill="#78350F" />
              {/* Row 12 */}
              <rect x="8" y="48" width="8" height="4" fill="#78350F" />
              <rect x="16" y="48" width="28" height="4" fill="#B45309" />
              <rect x="44" y="48" width="4" height="4" fill="#B45309" />
              <rect x="48" y="48" width="8" height="4" fill="#78350F" />
              {/* Row 13 */}
              <rect x="12" y="52" width="40" height="4" fill="#78350F" />
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <span
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#F8FAFC",
                letterSpacing: "-0.01em",
              }}
            >
              Stellaroid Earn
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#94A3B8",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Proof & Payment on Stellar
            </span>
          </div>
        </div>

        {/* Live badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            color: "#2DD4BF",
            background: "rgba(45, 212, 191, 0.1)",
            border: "1px solid rgba(45, 212, 191, 0.3)",
            borderRadius: "999px",
            padding: "8px 18px",
            fontWeight: 600,
            letterSpacing: "0.06em",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "8px",
              height: "8px",
              borderRadius: "999px",
              background: "#2DD4BF",
              boxShadow: "0 0 8px rgba(45,212,191,0.5)",
            }}
          />
          STELLAR TESTNET
        </div>
      </div>

      {/* Main headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
          gap: "16px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: "68px",
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            color: "#F8FAFC",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Bind the hash.</span>
          <span>Pay the wallet.</span>
          <span
            style={{
              background:
                "linear-gradient(90deg, #F59E0B 0%, #8B5CF6 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Prove the work.
          </span>
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#94A3B8",
            lineHeight: 1.5,
            maxWidth: "700px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Verify credentials on-chain and pay graduates directly in XLM.</span>
          <span>No invoice, no platform, no wait.</span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "4px",
          background:
            "linear-gradient(90deg, #F59E0B 0%, #8B5CF6 50%, #2DD4BF 100%)",
          display: "flex",
        }}
      />
    </div>,
    { ...size },
  );
}
