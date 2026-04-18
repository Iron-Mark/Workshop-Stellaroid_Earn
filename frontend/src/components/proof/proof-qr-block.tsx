"use client";

import { useEffect, useState } from "react";
import { ProofQr } from "./proof-qr";

interface ProofQrBlockProps {
  hash: string;
}

export function ProofQrBlock({ hash }: ProofQrBlockProps) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    setUrl(`${window.location.origin}/proof/${hash}`);
  }, [hash]);

  return (
    <div className="flex items-center gap-4 border-t border-border pt-4">
      {url ? (
        <ProofQr url={url} size={96} />
      ) : (
        <div
          className="w-24 h-24 rounded shrink-0 bg-[#F8FAFC] p-1.5"
          aria-hidden="true"
        />
      )}
      <div className="text-[0.8125rem] text-text-muted leading-relaxed">
        <strong className="block text-text text-sm mb-0.5">Scan to verify</strong>
        Point a phone camera at the QR to open this Proof Block without a wallet.
      </div>
    </div>
  );
}

export default ProofQrBlock;
