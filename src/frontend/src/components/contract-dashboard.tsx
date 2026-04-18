"use client";

import { useEffect, useRef, useState } from "react";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import {
  CertificateRecord,
  getCertificate,
  linkPayment,
  registerCertificate,
  verifyCertificate,
} from "@/lib/contract-client";
import { parseAmountToInt, shortenAddress } from "@/lib/format";
import { appConfig, hasRequiredConfig } from "@/lib/config";
import type { TxFeedback } from "@/lib/types";

export function ContractDashboard() {
  const { wallet, connectWallet, disconnectWallet } = useFreighterWallet();
  const [txFeedback, setTxFeedback] = useState<TxFeedback>({ state: "idle", title: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [studentAddr, setStudentAddr] = useState("");
  const [certHash, setCertHash] = useState("");
  const [lookupCert, setLookupCert] = useState<CertificateRecord | null | "missing">(null);
  const [payAmount, setPayAmount] = useState("10");
  const [rpcHealth, setRpcHealth] = useState<"checking" | "healthy" | "slow">("checking");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const configured = hasRequiredConfig();

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    const probe = async () => {
      const sentinel = "0".repeat(64);
      const started = Date.now();
      try {
        await getCertificate(sentinel);
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

  const actionsBlocked =
    !configured ||
    isSubmitting ||
    wallet.status !== "connected" ||
    !wallet.address ||
    !wallet.isExpectedNetwork;

  function onError(title: string, error: unknown) {
    setTxFeedback({
      state: "error",
      title,
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }

  async function handleRegister() {
    if (!wallet.address) return;
    setIsSubmitting(true);
    setTxFeedback({ state: "signing", title: "Awaiting issuer signature in Freighter..." });
    try {
      const res = await registerCertificate(wallet.address, studentAddr.trim(), certHash);
      setTxFeedback({ state: "success", title: "Certificate registered", hash: res?.hash });
    } catch (error) {
      onError("Register failed", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerify() {
    if (!wallet.address) return;
    setIsSubmitting(true);
    setTxFeedback({ state: "signing", title: "Awaiting signature in Freighter..." });
    try {
      const res = await verifyCertificate(wallet.address, certHash);
      setTxFeedback({
        state: "success",
        title: res?.result ? "Verified ✓" : "Hash not found on-chain",
        hash: res?.hash,
      });
    } catch (error) {
      onError("Verify failed", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLookup() {
    try {
      const cert = await getCertificate(certHash);
      setLookupCert(cert ?? "missing");
    } catch (error) {
      setLookupCert(null);
      onError("Lookup failed", error);
    }
  }

  async function handlePay() {
    if (!wallet.address) return;
    setIsSubmitting(true);
    setTxFeedback({ state: "signing", title: "Awaiting employer signature in Freighter..." });
    try {
      const amount = parseAmountToInt(payAmount, appConfig.assetDecimals);
      const res = await linkPayment(wallet.address, studentAddr.trim(), certHash, amount);
      setTxFeedback({ state: "success", title: "Payment settled", hash: res?.hash });
    } catch (error) {
      onError("Payment failed", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>Stellaroid Earn</h1>
        <p style={styles.subtle}>
          On-chain credential registry — Network: <code>{appConfig.network}</code> · Asset:{" "}
          <code>{appConfig.assetCode}</code>
        </p>
        <p style={styles.subtle}>
          Contract:{" "}
          <a
            href={`${appConfig.explorerUrl}/contract/${appConfig.contractId}`}
            target="_blank"
            rel="noreferrer"
          >
            <code>{shortenAddress(appConfig.contractId)}</code>
          </a>
        </p>
        <p
          style={{
            ...styles.subtle,
            color: rpcHealth === "slow" ? "#B45309" : "#16A34A",
          }}
        >
          {rpcHealth === "checking" && "• Checking RPC…"}
          {rpcHealth === "healthy" && "● RPC healthy"}
          {rpcHealth === "slow" &&
            "● Testnet latency is spiking — signed txs may take up to 15s to settle."}
        </p>
      </header>

      <section style={styles.card}>
        <h2>1. Connect Wallet</h2>
        <p>
          Status: <strong>{wallet.status}</strong> — {shortenAddress(wallet.address)}
        </p>
        {wallet.error && <p style={styles.error}>{wallet.error}</p>}

        {wallet.status !== "connected" ? (
          <button
            onClick={connectWallet}
            disabled={wallet.status === "connecting"}
            style={styles.button}
          >
            {wallet.status === "connecting" ? "Connecting..." : "Connect Freighter"}
          </button>
        ) : (
          <button onClick={disconnectWallet} style={styles.button}>
            Disconnect
          </button>
        )}

        {wallet.status === "connected" && !wallet.isExpectedNetwork && (
          <p style={styles.warn}>Switch Freighter to {appConfig.network}.</p>
        )}
      </section>

      {!configured && (
        <section style={{ ...styles.card, ...styles.warnCard }}>
          <strong>Contract not configured.</strong> Set{" "}
          <code>NEXT_PUBLIC_SOROBAN_CONTRACT_ID</code> in <code>.env.local</code>.
        </section>
      )}

      <section style={styles.card}>
        <h2>2. Shared Inputs</h2>
        <label style={styles.label}>
          Student wallet (G...)
          <input
            value={studentAddr}
            onChange={(e) => setStudentAddr(e.target.value)}
            placeholder="GAWIOVGF..."
            style={styles.inputMono}
          />
        </label>
        <label style={styles.label}>
          Certificate hash (64 hex chars)
          <input
            value={certHash}
            onChange={(e) => setCertHash(e.target.value)}
            placeholder="0101010101010101010101010101010101010101010101010101010101010101"
            style={styles.inputMono}
          />
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
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
            style={styles.buttonSecondary}
          >
            Compute SHA-256 from file
          </button>
          <span style={styles.subtle}>
            Drops a PDF/certificate and auto-fills the hash above.
          </span>
        </div>
      </section>

      <section style={styles.card}>
        <h2>3. Issuer — Register Certificate</h2>
        <p style={styles.subtle}>
          Your connected wallet signs as the issuer. Binds the hash to the student wallet.
        </p>
        <button onClick={handleRegister} disabled={actionsBlocked} style={styles.button}>
          Register Certificate
        </button>
      </section>

      <section style={styles.card}>
        <h2>4. Verify Certificate</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={handleLookup} disabled={!configured} style={styles.buttonSecondary}>
            Look up (read-only)
          </button>
          <button onClick={handleVerify} disabled={actionsBlocked} style={styles.button}>
            Mark Verified (on-chain)
          </button>
        </div>
        {lookupCert === "missing" && <p style={styles.warn}>No certificate for that hash.</p>}
        {lookupCert && lookupCert !== "missing" && (
          <div style={styles.feedback}>
            <p>
              Owner: <code>{shortenAddress(lookupCert.owner)}</code>
            </p>
            <p>
              Issuer: <code>{shortenAddress(lookupCert.issuer)}</code>
            </p>
            <p>
              Verified:{" "}
              <strong style={{ color: lookupCert.verified ? "#16A34A" : "#64748B" }}>
                {lookupCert.verified ? "✓ yes" : "not yet"}
              </strong>
            </p>
          </div>
        )}
      </section>

      <section style={styles.card}>
        <h2>5. Employer — Pay Verified Student</h2>
        <p style={styles.subtle}>
          Requires the certificate to be verified first. Your wallet signs as the employer.
        </p>
        <label style={styles.label}>
          Amount ({appConfig.assetCode})
          <input
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            style={styles.input}
          />
        </label>
        <button onClick={handlePay} disabled={actionsBlocked} style={styles.button}>
          {isSubmitting ? "Settling on Stellar…" : "Pay Student"}
        </button>
      </section>

      {txFeedback.state !== "idle" && (
        <section style={styles.card}>
          <strong>{txFeedback.title}</strong>
          {txFeedback.detail && <p style={styles.error}>{txFeedback.detail}</p>}
          {txFeedback.hash && (
            <p>
              <a
                href={`${appConfig.explorerUrl}/tx/${txFeedback.hash}`}
                target="_blank"
                rel="noreferrer"
              >
                View on Stellar Expert →
              </a>
            </p>
          )}
        </section>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 720, margin: "0 auto", padding: 24, fontFamily: "system-ui" },
  header: { marginBottom: 24 },
  subtle: { color: "#64748B", fontSize: 14, margin: "4px 0" },
  card: {
    border: "1px solid #E2E8F0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    background: "#FFFFFF",
  },
  warnCard: { background: "#FEF3C7", borderColor: "#F59E0B" },
  label: { display: "block", marginBottom: 8, fontSize: 14 },
  input: {
    display: "block",
    width: "100%",
    padding: 8,
    marginTop: 4,
    border: "1px solid #CBD5E1",
    borderRadius: 4,
  },
  inputMono: {
    display: "block",
    width: "100%",
    padding: 8,
    marginTop: 4,
    border: "1px solid #CBD5E1",
    borderRadius: 4,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 13,
  },
  button: {
    padding: "8px 16px",
    borderRadius: 4,
    border: "1px solid #1E40AF",
    background: "#1E40AF",
    color: "#FFFFFF",
    cursor: "pointer",
  },
  buttonSecondary: {
    padding: "8px 16px",
    borderRadius: 4,
    border: "1px solid #CBD5E1",
    background: "#F8FAFC",
    color: "#0F172A",
    cursor: "pointer",
  },
  warn: { color: "#B45309" },
  error: { color: "#DC2626" },
  feedback: {
    marginTop: 12,
    padding: 12,
    background: "#F8FAFC",
    borderRadius: 4,
  },
};
