"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/page.module.css";

type Locale = "en" | "tl";

const STORAGE_KEY = "stellaroid:locale";

const copy = {
  en: {
    eyebrow: "Stellar Testnet · Soroban · Freighter",
    h1a: "Prove your credentials.",
    h1b: "Get paid instantly.",
    lede:
      "A Philippine bootcamp graduate registers a certificate hash on Stellar; an employer verifies it in seconds and pays the grad directly in XLM. Stellar\u2019s sub-cent fees make per-cert settlement viable.",
    ctaPrimary: "Try the demo \u2192",
    ctaGhost: "See a sample Proof Block \u2014 no wallet needed",
    toggleLabel: "Tagalog",
  },
  tl: {
    eyebrow: "Stellar Testnet · Soroban · Freighter",
    h1a: "Patunayan ang iyong kredensyal.",
    h1b: "Makatanggap ng bayad agad.",
    lede:
      "Nagrerehistro ang isang Pilipinong bootcamp graduate ng certificate hash sa Stellar; bina-verify ito ng employer sa loob ng ilang segundo at direktang binabayaran ang graduate sa XLM. Sa sub-cent na bayad ng Stellar, sulit ang bawat sertipiko.",
    ctaPrimary: "Subukan ang demo \u2192",
    ctaGhost: "Tingnan ang sample Proof Block \u2014 walang wallet kailangan",
    toggleLabel: "English",
  },
} satisfies Record<Locale, Record<string, string>>;

const SAMPLE_HASH =
  "1e8078e36333023c46f11a0bd990f97b62bd13ae086597de6a3db8e66d4b3a22";

export function LocalizedHero() {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved === "en" || saved === "tl") setLocale(saved);
    } catch {
      // ignore
    }
  }, []);

  function toggle() {
    const next: Locale = locale === "en" ? "tl" : "en";
    setLocale(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }

  const t = copy[locale];

  return (
    <section className={styles.hero}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 8,
        }}
      >
        <span className={styles.eyebrow}>{t.eyebrow}</span>
        <button
          type="button"
          onClick={toggle}
          aria-label={`Switch to ${t.toggleLabel}`}
          style={{
            appearance: "none",
            border: "1px solid var(--color-border)",
            background: "transparent",
            color: "var(--color-text-muted)",
            borderRadius: 999,
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.04em",
            cursor: "pointer",
          }}
        >
          {locale === "en" ? "🇵🇭 Tagalog" : "🇬🇧 English"}
        </button>
      </div>
      <h1 className={styles.h1}>
        {t.h1a}
        <br />
        <em>{t.h1b}</em>
      </h1>
      <p className={styles.lede}>{t.lede}</p>
      <div className={styles.ctaRow}>
        <Link href="/app" className={styles.ctaPrimary}>
          {t.ctaPrimary}
        </Link>
        <Link href={`/proof/${SAMPLE_HASH}`} className={styles.ctaGhost}>
          {t.ctaGhost}
        </Link>
      </div>
      <img
        src="/illust-hero.svg"
        alt="Register → Verify → Pay flow"
        width={560}
        height={187}
        style={{
          display: "block",
          maxWidth: "100%",
          height: "auto",
          margin: "48px auto 0",
          imageRendering: "pixelated",
        }}
      />
    </section>
  );
}

export default LocalizedHero;
