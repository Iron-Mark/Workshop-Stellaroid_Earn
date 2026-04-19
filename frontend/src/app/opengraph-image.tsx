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
        background:
          "linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #312E81 100%)",
        padding: "80px",
        fontFamily: "sans-serif",
        color: "#F8FAFC",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          fontSize: "30px",
          fontWeight: 700,
          color: "#F59E0B",
          letterSpacing: "-0.02em",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "#F59E0B",
            alignItems: "center",
            justifyContent: "center",
            color: "#0F172A",
            fontSize: "34px",
            fontWeight: 800,
          }}
        >
          S
        </div>
        STELLAROID EARN
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
          gap: "18px",
        }}
      >
        <div
          style={{
            fontSize: "24px",
            color: "#94A3B8",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            fontWeight: 500,
          }}
        >
          Proof-of-work on Stellar
        </div>
        <div
          style={{
            fontSize: "76px",
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            color: "#F8FAFC",
            display: "flex",
            flexDirection: "column",
          }}
        >
          Bind the hash.
          <br />
          Pay the wallet.
          <br />
          <span style={{ color: "#F59E0B" }}>Prove the work.</span>
        </div>
        <div
          style={{
            marginTop: "10px",
            fontSize: "22px",
            color: "#94A3B8",
            lineHeight: 1.4,
            maxWidth: "900px",
          }}
        >
          Verify a credential and pay directly in XLM, no invoice, no platform,
          no wait.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: "80px",
          right: "80px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "18px",
          color: "#10B981",
          background: "rgba(16, 185, 129, 0.12)",
          border: "1px solid rgba(16, 185, 129, 0.4)",
          borderRadius: "999px",
          padding: "10px 22px",
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
        LIVE · STELLAR TESTNET
      </div>
    </div>,
    { ...size },
  );
}
