"use client";

import { useEffect, useState } from "react";
// @ts-expect-error — qrcode ships a browser build without types; the Node-facing main entry breaks in webpack.
import * as QRCode from "qrcode/lib/browser";

interface ProofQrProps {
  url: string;
  size?: number;
}

export function ProofQr({ url, size = 96 }: ProofQrProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(url, {
      margin: 1,
      width: size * 2,
      color: { dark: "#0F172A", light: "#F8FAFC" },
      errorCorrectionLevel: "M",
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [url, size]);

  if (!dataUrl) {
    return (
      <div
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          background: "var(--color-surface-2)",
          borderRadius: 6,
        }}
      />
    );
  }

  return (
    <img
      src={dataUrl}
      alt={`QR code linking to ${url}`}
      width={size}
      height={size}
      style={{ borderRadius: 6, background: "#F8FAFC", padding: 6 }}
    />
  );
}

export default ProofQr;
