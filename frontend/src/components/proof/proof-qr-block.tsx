"use client";

import { useEffect, useState } from "react";
import { ProofQr } from "./proof-qr";
import styles from "./proof-card.module.css";

interface ProofQrBlockProps {
  hash: string;
}

export function ProofQrBlock({ hash }: ProofQrBlockProps) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    setUrl(`${window.location.origin}/proof/${hash}`);
  }, [hash]);

  return (
    <div className={styles.qrBlock}>
      {url ? (
        <ProofQr url={url} size={96} />
      ) : (
        <div className={styles.qrImage} aria-hidden="true" />
      )}
      <div className={styles.qrCopy}>
        <strong>Scan to verify</strong>
        Point a phone camera at the QR to open this Proof Block without a wallet.
      </div>
    </div>
  );
}

export default ProofQrBlock;
