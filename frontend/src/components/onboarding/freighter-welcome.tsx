"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import styles from "./freighter-welcome.module.css";

const STORAGE_KEY = "stellaroid:freighter-welcome-dismissed";

export function FreighterWelcome() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="freighter-welcome-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div className={styles.modal}>
        <p className={styles.eyebrow}>New to Stellar?</p>
        <h2 id="freighter-welcome-title" className={styles.title}>
          You&rsquo;ll need a wallet to sign. Here&rsquo;s the 90-second version.
        </h2>
        <p className={styles.intro}>
          Stellaroid Earn runs on Stellar testnet. Every action is signed by your
          own wallet — no email, no password, no KYC.
        </p>

        <ul className={styles.list}>
          <li className={styles.item}>
            <span className={styles.bullet}>1</span>
            <span className={styles.itemBody}>
              Install{" "}
              <a href="https://www.freighter.app/" target="_blank" rel="noreferrer">
                Freighter
              </a>{" "}
              — the Stellar wallet browser extension. <strong>Switch it to
              testnet</strong> after install.
            </span>
          </li>
          <li className={styles.item}>
            <span className={styles.bullet}>2</span>
            <span className={styles.itemBody}>
              Fund your testnet account with free XLM via{" "}
              <a href="https://friendbot.stellar.org/" target="_blank" rel="noreferrer">
                friendbot
              </a>{" "}
              — one click, no signup.
            </span>
          </li>
          <li className={styles.item}>
            <span className={styles.bullet}>3</span>
            <span className={styles.itemBody}>
              Click <strong>Connect wallet</strong> above. Sign register / verify / pay
              with one tap each. Every transaction costs a fraction of a cent and
              settles in ~5 seconds.
            </span>
          </li>
        </ul>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              window.open("https://www.freighter.app/", "_blank", "noopener,noreferrer");
            }}
          >
            Get Freighter
          </Button>
          <Button variant="primary" size="sm" onClick={dismiss}>
            Got it — let&rsquo;s go
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FreighterWelcome;
