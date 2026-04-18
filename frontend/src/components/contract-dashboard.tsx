"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import {
  CertificateRecord,
  getCertificate,
  linkPayment,
  registerCertificate,
  verifyCertificate,
} from "@/lib/contract-client";
import { parseAmountToInt, shortenAddress } from "@/lib/format";
import { isValidStellarAddress } from "@/lib/validators";
import { appConfig, hasRequiredConfig } from "@/lib/config";

type CardFeedback =
  | { state: "idle" }
  | { state: "pending"; title: string }
  | { state: "success"; title: string; hash?: string }
  | { state: "error"; title: string; detail: string };

const idle: CardFeedback = { state: "idle" };

export function ContractDashboard() {
  const { wallet, connectWallet, disconnectWallet } = useFreighterWallet();

  const [studentAddr, setStudentAddr] = useState("");
  const [certHash, setCertHash] = useState("");
  const [payAmount, setPayAmount] = useState("10");

  const [registerFb, setRegisterFb] = useState<CardFeedback>(idle);
  const [verifyFb, setVerifyFb] = useState<CardFeedback>(idle);
  const [payFb, setPayFb] = useState<CardFeedback>(idle);
  const [lookupCert, setLookupCert] = useState<CertificateRecord | null | "missing">(null);
  const [rpcHealth, setRpcHealth] = useState<"checking" | "healthy" | "slow">("checking");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const configured = hasRequiredConfig();
  const walletReady =
    wallet.status === "connected" && !!wallet.address && wallet.isExpectedNetwork;

  const hashValid = useMemo(
    () => /^[0-9a-fA-F]{64}$/.test(certHash.trim().replace(/^0x/i, "")),
    [certHash],
  );
  const studentValid = useMemo(
    () => isValidStellarAddress(studentAddr),
    [studentAddr],
  );
  const amountValid = useMemo(() => {
    const n = Number(payAmount);
    return Number.isFinite(n) && n > 0;
  }, [payAmount]);

  const inputsValid = hashValid && studentValid;
  const canRegister = configured && walletReady && inputsValid;
  const canVerify = configured && walletReady && hashValid;
  const canLookup = configured && hashValid;
  const canPay = configured && walletReady && inputsValid && amountValid;

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    const probe = async () => {
      const started = Date.now();
      try {
        await getCertificate("0".repeat(64));
        if (!cancelled) {
          setRpcHealth(Date.now() - started > 4000 ? "slow" : "healthy");
        }
      } catch {
        if (!cancelled) setRpcHealth("slow");
      }
    };
    probe();
    return () => {
      cancelled = true;
    };
  }, [configured]);

  async function handleHashFromFile(file: File) {
    const buf = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buf);
    const hex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setCertHash(hex);
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* noop */
    }
  }

  async function handleRegister() {
    if (!wallet.address) return;
    setRegisterFb({ state: "pending", title: "Awaiting issuer signature…" });
    try {
      const res = await registerCertificate(
        wallet.address,
        studentAddr.trim(),
        certHash.trim(),
      );
      setRegisterFb({
        state: "success",
        title: "Certificate registered",
        hash: res?.hash,
      });
    } catch (error) {
      setRegisterFb({
        state: "error",
        title: "Register failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async function handleVerify() {
    if (!wallet.address) return;
    setVerifyFb({ state: "pending", title: "Awaiting signature…" });
    try {
      const res = await verifyCertificate(wallet.address, certHash.trim());
      setVerifyFb({
        state: "success",
        title: res?.result ? "Verified ✓" : "Hash not found on-chain",
        hash: res?.hash,
      });
    } catch (error) {
      setVerifyFb({
        state: "error",
        title: "Verify failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async function handleLookup() {
    try {
      const cert = await getCertificate(certHash.trim());
      setLookupCert(cert ?? "missing");
    } catch (error) {
      setLookupCert(null);
      setVerifyFb({
        state: "error",
        title: "Lookup failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async function handlePay() {
    if (!wallet.address) return;
    setPayFb({ state: "pending", title: "Awaiting employer signature…" });
    try {
      const amount = parseAmountToInt(payAmount, appConfig.assetDecimals);
      const res = await linkPayment(
        wallet.address,
        studentAddr.trim(),
        certHash.trim(),
        amount,
      );
      setPayFb({
        state: "success",
        title: `Paid ${payAmount} ${appConfig.assetCode}`,
        hash: res?.hash,
      });
    } catch (error) {
      setPayFb({
        state: "error",
        title: "Payment failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.h1}>Stellaroid Earn</h1>
        <p style={styles.lede}>
          On-chain credential registry → employer pays verified graduate in one click.
          Stellar testnet.
        </p>
        <div style={styles.metaRow}>
          <span style={styles.pill}>Network: {appConfig.network}</span>
          <span style={styles.pill}>Asset: {appConfig.assetCode}</span>
          <span
            style={{
              ...styles.pill,
              color: rpcHealth === "slow" ? "#B45309" : "#166534",
              background: rpcHealth === "slow" ? "#FEF3C7" : "#DCFCE7",
              borderColor: rpcHealth === "slow" ? "#F59E0B" : "#86EFAC",
            }}
          >
            {rpcHealth === "checking" && "• Checking RPC"}
            {rpcHealth === "healthy" && "● RPC healthy"}
            {rpcHealth === "slow" && "● Testnet slow — up to 15s per tx"}
          </span>
        </div>
        <div style={styles.contractRow}>
          <span style={styles.mono}>
            Contract: {shortenAddress(appConfig.contractId)}
          </span>
          <button
            type="button"
            onClick={() => copy(appConfig.contractId)}
            style={styles.ghost}
            title="Copy full contract ID"
          >
            Copy
          </button>
          <a
            href={`${appConfig.explorerUrl}/contract/${appConfig.contractId}`}
            target="_blank"
            rel="noreferrer"
            style={styles.link}
          >
            Explorer ↗
          </a>
        </div>
      </header>

      <section style={styles.card}>
        <h2 style={styles.h2}>1. Connect Freighter</h2>
        <p style={styles.subtle}>
          {wallet.status === "connected"
            ? `Signed in as ${shortenAddress(wallet.address)}`
            : "One wallet can play issuer + employer in the demo."}
        </p>
        {wallet.error && <p style={styles.error}>{wallet.error}</p>}
        {wallet.status !== "connected" ? (
          <button
            onClick={connectWallet}
            disabled={wallet.status === "connecting"}
            style={styles.primary}
          >
            {wallet.status === "connecting" ? "Connecting…" : "Connect Freighter"}
          </button>
        ) : (
          <button onClick={disconnectWallet} style={styles.secondary}>
            Disconnect
          </button>
        )}
        {wallet.status === "connected" && !wallet.isExpectedNetwork && (
          <p style={styles.warn}>Switch Freighter to {appConfig.network} first.</p>
        )}
      </section>

      {!configured && (
        <section style={{ ...styles.card, ...styles.warnCard }}>
          <strong>Contract not configured.</strong> Set{" "}
          <code>NEXT_PUBLIC_SOROBAN_CONTRACT_ID</code> in <code>.env.local</code>.
        </section>
      )}

      <section style={styles.card}>
        <h2 style={styles.h2}>2. Shared inputs</h2>

        <label style={styles.label}>
          <span style={styles.labelText}>Student wallet (G…)</span>
          <input
            value={studentAddr}
            onChange={(e) => setStudentAddr(e.target.value)}
            placeholder="GAWIOVGF…"
            style={fieldStyle(studentAddr.length === 0 || studentValid)}
          />
        </label>
        {studentAddr.length > 0 && !studentValid && (
          <p style={styles.fieldError}>Not a valid Stellar G-address.</p>
        )}
        <div style={styles.inlineRow}>
          <button
            type="button"
            onClick={() => wallet.address && setStudentAddr(wallet.address)}
            disabled={!wallet.address}
            style={styles.secondary}
          >
            Use my connected wallet
          </button>
          <span style={styles.subtle}>
            Single-wallet demo: issuer and student become the same address.
          </span>
        </div>

        <label style={{ ...styles.label, marginTop: 16 }}>
          <span style={styles.labelText}>Certificate hash (64 hex chars)</span>
          <input
            value={certHash}
            onChange={(e) => setCertHash(e.target.value)}
            placeholder="35a19276…6702e"
            style={{
              ...fieldStyle(certHash.length === 0 || hashValid),
              fontFamily: "var(--font-mono), ui-monospace, monospace",
            }}
          />
        </label>
        {certHash.length > 0 && !hashValid && (
          <p style={styles.fieldError}>Must be exactly 64 hexadecimal characters.</p>
        )}
        <div style={styles.inlineRow}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleHashFromFile(f);
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={styles.secondary}
          >
            Compute SHA-256 from file
          </button>
          <span style={styles.subtle}>Drop any PDF/image — auto-fills the hash.</span>
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.h2}>3. Issuer — Register Certificate</h2>
        <p style={styles.subtle}>
          Binds the hash to the student wallet. Your connected wallet signs as issuer.
        </p>
        <button
          onClick={handleRegister}
          disabled={!canRegister || registerFb.state === "pending"}
          style={styles.primary}
        >
          {registerFb.state === "pending" ? "Settling on Stellar…" : "Register Certificate"}
        </button>
        <Feedback fb={registerFb} />
      </section>

      <section style={styles.card}>
        <h2 style={styles.h2}>4. Verify certificate</h2>
        <div style={styles.inlineRow}>
          <button onClick={handleLookup} disabled={!canLookup} style={styles.secondary}>
            Look up (read-only)
          </button>
          <button
            onClick={handleVerify}
            disabled={!canVerify || verifyFb.state === "pending"}
            style={styles.primary}
          >
            {verifyFb.state === "pending" ? "Settling…" : "Mark Verified on-chain"}
          </button>
        </div>
        {lookupCert === "missing" && (
          <p style={styles.warn}>No certificate for that hash.</p>
        )}
        {lookupCert && lookupCert !== "missing" && (
          <div style={styles.receipt}>
            <p style={{ margin: "4px 0" }}>
              Owner: <span style={styles.mono}>{shortenAddress(lookupCert.owner)}</span>
            </p>
            <p style={{ margin: "4px 0" }}>
              Issuer: <span style={styles.mono}>{shortenAddress(lookupCert.issuer)}</span>
            </p>
            <p style={{ margin: "4px 0" }}>
              Status:{" "}
              <strong style={{ color: lookupCert.verified ? "#16A34A" : "#64748B" }}>
                {lookupCert.verified ? "✓ verified" : "not yet verified"}
              </strong>
            </p>
          </div>
        )}
        <Feedback fb={verifyFb} />
      </section>

      <section style={styles.card}>
        <h2 style={styles.h2}>5. Employer — Pay Verified Student</h2>
        <p style={styles.subtle}>
          Requires the certificate to be verified. Your wallet signs as employer.
        </p>
        <label style={styles.label}>
          <span style={styles.labelText}>Amount ({appConfig.assetCode})</span>
          <input
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            style={fieldStyle(amountValid)}
          />
        </label>
        {!amountValid && (
          <p style={styles.fieldError}>Amount must be greater than zero.</p>
        )}
        <button
          onClick={handlePay}
          disabled={!canPay || payFb.state === "pending"}
          style={styles.primary}
        >
          {payFb.state === "pending" ? "Settling on Stellar…" : "Pay Student"}
        </button>
        <Feedback fb={payFb} />
      </section>
    </main>
  );
}

function Feedback({ fb }: { fb: CardFeedback }) {
  if (fb.state === "idle") return null;
  const accent =
    fb.state === "success"
      ? "var(--color-success)"
      : fb.state === "error"
      ? "var(--color-danger)"
      : "var(--color-primary)";
  return (
    <div
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: "var(--radius-sm)",
        background: "var(--color-surface-2)",
        borderLeft: `3px solid ${accent}`,
        color: "var(--color-text)",
      }}
    >
      <strong style={{ color: accent }}>{fb.title}</strong>
      {fb.state === "error" && (
        <p style={{ margin: "4px 0 0", color: "var(--color-text-muted)" }}>
          {fb.detail}
        </p>
      )}
      {fb.state === "success" && fb.hash && (
        <p style={{ margin: "6px 0 0" }}>
          <a
            href={`${appConfig.explorerUrl}/tx/${fb.hash}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--color-primary)", fontWeight: 600 }}
          >
            View on Stellar Expert ↗
          </a>{" "}
          <button
            type="button"
            onClick={() =>
              navigator.clipboard.writeText(fb.hash ?? "").catch(() => {})
            }
            style={{
              ...styles.ghost,
              marginLeft: 8,
              fontSize: 12,
              padding: "2px 8px",
            }}
          >
            Copy hash
          </button>
        </p>
      )}
    </div>
  );
}

function fieldStyle(valid: boolean): React.CSSProperties {
  return {
    display: "block",
    width: "100%",
    padding: "10px 12px",
    marginTop: 6,
    border: `1px solid ${valid ? "var(--color-border)" : "var(--color-danger)"}`,
    borderRadius: "var(--radius-sm)",
    fontSize: 14,
    background: "var(--color-bg)",
    color: "var(--color-text)",
    outline: "none",
  };
}

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: 760, margin: "0 auto", padding: "32px 20px 64px" },
  header: { marginBottom: 28 },
  h1: {
    margin: 0,
    fontFamily: "var(--font-sans)",
    fontWeight: 700,
    fontSize: 36,
    letterSpacing: -0.5,
    color: "var(--color-text)",
  },
  h2: {
    margin: "0 0 8px",
    fontFamily: "var(--font-sans)",
    fontWeight: 600,
    fontSize: 18,
    color: "var(--color-text)",
  },
  lede: {
    color: "var(--color-text-muted)",
    fontSize: 15,
    lineHeight: 1.5,
    margin: "8px 0 16px",
  },
  metaRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 },
  pill: {
    fontSize: 12,
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid var(--color-border)",
    background: "var(--color-surface-2)",
    color: "var(--color-text-muted)",
  },
  contractRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 13,
    color: "var(--color-text-muted)",
    flexWrap: "wrap",
  },
  mono: {
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    color: "var(--color-text)",
  },
  link: { color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" },
  card: {
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    padding: 20,
    marginBottom: 16,
    background: "var(--color-surface)",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
  },
  warnCard: {
    background: "rgba(245, 158, 11, 0.12)",
    borderColor: "var(--color-warning)",
  },
  subtle: { color: "var(--color-text-muted)", fontSize: 13, margin: "0 0 12px" },
  label: { display: "block", marginBottom: 4, fontSize: 14 },
  labelText: {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--color-text-muted)",
  },
  inlineRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    flexWrap: "wrap",
  },
  primary: {
    padding: "10px 18px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--color-primary)",
    background: "var(--color-primary)",
    color: "var(--color-on-primary)",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  secondary: {
    padding: "10px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--color-border)",
    background: "var(--color-surface-2)",
    color: "var(--color-text)",
    cursor: "pointer",
    fontSize: 14,
  },
  ghost: {
    padding: "4px 10px",
    borderRadius: 4,
    border: "1px solid var(--color-border)",
    background: "transparent",
    color: "var(--color-text-muted)",
    cursor: "pointer",
    fontSize: 12,
  },
  warn: { color: "var(--color-warning)", fontSize: 14 },
  error: { color: "var(--color-danger)", fontSize: 14 },
  fieldError: { color: "var(--color-danger)", fontSize: 12, margin: "4px 0 0" },
  receipt: {
    marginTop: 12,
    padding: 12,
    background: "var(--color-surface-2)",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--color-border)",
  },
};
