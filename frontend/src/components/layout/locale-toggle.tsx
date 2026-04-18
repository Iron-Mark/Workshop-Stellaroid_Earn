"use client";

import { useEffect, useState } from "react";
import styles from "./locale-toggle.module.css";

export type Locale = "en" | "tl";

export const LOCALE_STORAGE_KEY = "stellaroid:locale";
export const LOCALE_CHANGE_EVENT = "stellaroid:locale-change";

function PhFlag() {
  return (
    <svg
      className={styles.flag}
      viewBox="0 0 24 16"
      width="20"
      height="14"
      aria-hidden="true"
    >
      <rect width="24" height="8" fill="#0038A8" />
      <rect y="8" width="24" height="8" fill="#CE1126" />
      <polygon points="0,0 10,8 0,16" fill="#FFFFFF" />
      <circle cx="3.4" cy="8" r="1.1" fill="#FCD116" />
    </svg>
  );
}

function GbFlag() {
  return (
    <svg
      className={styles.flag}
      viewBox="0 0 24 16"
      width="20"
      height="14"
      aria-hidden="true"
    >
      <rect width="24" height="16" fill="#012169" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#FFFFFF" strokeWidth="2.4" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#C8102E" strokeWidth="1.2" />
      <path d="M12,0 V16 M0,8 H24" stroke="#FFFFFF" strokeWidth="4" />
      <path d="M12,0 V16 M0,8 H24" stroke="#C8102E" strokeWidth="2" />
    </svg>
  );
}

export function LocaleToggle() {
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

  function toggle() {
    const next: Locale = locale === "en" ? "tl" : "en";
    setLocale(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent<Locale>(LOCALE_CHANGE_EVENT, { detail: next }));
  }

  const nextLabel = locale === "en" ? "Tagalog" : "English";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch language to ${nextLabel}`}
      className={styles.toggle}
    >
      {locale === "en" ? <PhFlag /> : <GbFlag />}
      <span className={styles.label}>
        {locale === "en" ? "Tagalog" : "English"}
      </span>
    </button>
  );
}

export default LocaleToggle;
