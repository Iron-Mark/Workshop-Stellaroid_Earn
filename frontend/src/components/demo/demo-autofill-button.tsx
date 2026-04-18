"use client";

import styles from "./demo-autofill-button.module.css";

export const DEMO_AUTOFILL_EVENT = "demo:autofill";

export interface DemoAutofillDetail {
  studentAddr: string;
  certHash: string;
  amount: string;
}

export const DEMO_AUTOFILL_SAMPLE: DemoAutofillDetail = {
  studentAddr: "GDQOE23CFSUMSVQK4Y5JHPPYK73VYCNHZHA7ENKCV37P6SUEO6XQBKPP",
  certHash: "a1b2c3d4e5f6078899aabbccddeeff00112233445566778899aabbccddeeff00",
  amount: "10",
};

export function DemoAutofillButton() {
  function handleClick() {
    window.dispatchEvent(
      new CustomEvent<DemoAutofillDetail>(DEMO_AUTOFILL_EVENT, {
        detail: DEMO_AUTOFILL_SAMPLE,
      }),
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={styles.fab}
      aria-label="Autofill demo inputs"
      title="Autofill demo inputs"
    >
      <span className={styles.dot} aria-hidden />
      Demo autofill
    </button>
  );
}

export default DemoAutofillButton;
