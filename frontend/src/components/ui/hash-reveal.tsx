"use client";

import { useEffect, useState } from "react";
import styles from "./hash-reveal.module.css";

interface HashRevealProps {
  hash: string;
  /** characters per frame; default 4 */
  speed?: number;
  /** show short form (first8...last6) instead of full */
  short?: boolean;
}

export function HashReveal({ hash, speed = 4, short = false }: HashRevealProps) {
  const target = short && hash.length > 20
    ? `${hash.slice(0, 8)}…${hash.slice(-6)}`
    : hash;

  const [shown, setShown] = useState("");

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setShown(target);
      return;
    }
    setShown("");
    let i = 0;
    const id = window.setInterval(() => {
      i += speed;
      setShown(target.slice(0, i));
      if (i >= target.length) window.clearInterval(id);
    }, 24);
    return () => window.clearInterval(id);
  }, [target, speed]);

  return (
    <code className={styles.hash} aria-label={`hash ${target}`}>
      {shown}
      {shown.length < target.length && <span className={styles.caret} aria-hidden="true" />}
    </code>
  );
}

export default HashReveal;
