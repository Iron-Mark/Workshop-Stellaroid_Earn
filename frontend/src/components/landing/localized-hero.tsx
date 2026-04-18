"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/page.module.css";
import { DEFAULT_SAMPLE_PROOF_HASH } from "@/lib/demo-data";
import {
  LOCALE_CHANGE_EVENT,
  LOCALE_STORAGE_KEY,
  LocaleToggle,
  type Locale,
} from "@/components/layout/locale-toggle";

const copy = {
  en: {
    eyebrow: "Stellar Testnet · Soroban · Freighter",
    h1a: "Prove Maria’s credentials.",
    h1b: "Pay her in the same breath.",
    lede:
      "Maria graduated top of her bootcamp in Quezon City. A Singapore employer hashes her diploma, verifies it on Stellar in five seconds, and pays her directly in XLM \u2014 no invoice, no platform, no three-week email thread. Sub-cent fees make every cert worth settling on-chain.",
    ctaPrimary: "Try the demo \u2192",
    ctaGhost: "See a sample Proof Block \u2014 no wallet needed",
  },
  tl: {
    eyebrow: "Stellar Testnet · Soroban · Freighter",
    h1a: "Patunayan ang kredensyal ni Maria.",
    h1b: "Bayaran siya nang sabay.",
    lede:
      "Nagtapos si Maria bilang nangunguna sa kanyang bootcamp sa Quezon City. I-ha-hash ng isang employer sa Singapore ang kanyang diploma, ibe-verify sa Stellar sa loob ng limang segundo, at direktang babayaran siya gamit ang XLM \u2014 walang invoice, walang platform, at walang tatlong linggong email thread. Dahil sa sub-cent fees, sulit i-settle on-chain ang bawat cert.",
    ctaPrimary: "Subukan ang demo \u2192",
    ctaGhost: "Tingnan ang sample Proof Block \u2014 walang wallet kailangan",
  },
} satisfies Record<Locale, Record<string, string>>;

export function LocalizedHero() {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      if (saved === "en" || saved === "tl") setLocale(saved);
    } catch {
      // ignore
    }
    function onChange(e: Event) {
      const next = (e as CustomEvent<Locale>).detail;
      if (next === "en" || next === "tl") setLocale(next);
    }
    window.addEventListener(LOCALE_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, onChange);
  }, []);

  const t = copy[locale];

  return (
    <section className={styles.hero}>
      <span className={styles.eyebrow}>{t.eyebrow}</span>
      <h1 className={styles.h1}>
        {t.h1a}
        <br />
        <em>{t.h1b}</em>
      </h1>
      <p className={styles.lede}>{t.lede}</p>
      <div className={styles.localeScope}>
        <span className={styles.localeScopeLabel}>
          View this hero in {locale === "en" ? "Tagalog" : "English"}
        </span>
        <LocaleToggle />
      </div>
      <div className={styles.ctaRow}>
        <Link href="/app" className={styles.ctaPrimary}>
          {t.ctaPrimary}
        </Link>
        <Link href={`/proof/${DEFAULT_SAMPLE_PROOF_HASH}`} className={styles.ctaGhost}>
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
