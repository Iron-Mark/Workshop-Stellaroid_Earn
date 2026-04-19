import type { Locale } from "@/components/layout/locale-toggle";

export type I18nDict = {
  hero: {
    eyebrow: string;
    h1a: string;
    h1b: string;
    lede: string;
    ctaPrimary: string;
    ctaGhost: string;
  };
  footer: {
    tagline: string;
  };
  about: {
    lede: string;
    problemKicker: string;
    approachKicker: string;
  };
  app: {
    connectTitle: string;
    connectSubtitle: string;
    issuerLabel: string;
    issuerDesc: string;
    employerLabel: string;
    employerDesc: string;
    issuerRegisterTitle: string;
    issuerRegisterSubtitle: string;
    issuerDoneTitle: string;
    issuerDoneSubtitle: string;
    verifyTitle: string;
    verifySubtitle: string;
    employerWaitTitle: string;
    employerWaitSubtitle: string;
    payTitle: string;
    paySubtitle: string;
    doneTitle: string;
    doneSubtitle: string;
  };
};

export const i18n: Record<Locale, I18nDict> = {
  en: {
    hero: {
      eyebrow: "Stellar Testnet / Soroban / Freighter",
      h1a: "Verify credentials.",
      h1b: "Settle payment in one flow.",
      lede: "Stellaroid Earn anchors certificate hashes on Stellar so employers can inspect the record and pay the graduate without leaving the workflow once an approved issuer or admin verifies it. No email thread, no invoice delay, no platform fee.",
      ctaPrimary: "Try the app →",
      ctaGhost: "See a sample proof →",
    },
    footer: {
      tagline:
        "On-chain credential registry on Stellar testnet. Built for the Stellar PH Bootcamp bootcamp.",
    },
    about: {
      lede: "A thin piece of software around one idea: certificates should be verifiable in seconds, not emails. And if they're verifiable, the grad should get paid on the same tap.",
      problemKicker:
        "The certificate is real. The problem is that proving it costs more than hiring around it.",
      approachKicker:
        "The canonical output isn't the UI; it's the event stream on stellar.expert. The proof is public by default.",
    },
    app: {
      connectTitle: "Connect your wallet to start",
      connectSubtitle: "You'll sign transactions with Freighter.",
      issuerLabel: "Issuer",
      issuerDesc: "Issue & manage",
      employerLabel: "Employer",
      employerDesc: "Inspect & pay",
      issuerRegisterTitle: "Register a certificate",
      issuerRegisterSubtitle:
        "Upload the PDF or paste a 64-char hex hash. You'll sign as the issuer.",
      issuerDoneTitle: "Certificate registered",
      issuerDoneSubtitle: "Trusted verification is done. Employers can now inspect the proof and pay the student.",
      verifyTitle: "Verify the credential",
      verifySubtitle: "Look it up first, then use an approved issuer or admin wallet to verify, suspend, or revoke it.",
      employerWaitTitle: "Wait for trusted verification",
      employerWaitSubtitle: "Employers can inspect the credential here, but payment only unlocks after an approved issuer or admin verifies it.",
      payTitle: "Pay the verified student",
      paySubtitle: "Send the payment amount linked to this certificate.",
      doneTitle: "All done",
      doneSubtitle: "The proof block is ready to share.",
    },
  },
  tl: {
    hero: {
      eyebrow: "Stellar Testnet / Soroban / Freighter",
      h1a: "I-verify ang credentials.",
      h1b: "I-settle ang bayad sa iisang flow.",
      lede: "I-anchor ang certificate hash sa Stellar. Kapag verified na ng approved issuer o admin, puwedeng i-check ng employer at magbayad agad — walang email thread, walang invoice delay, walang platform fee.",
      ctaPrimary: "Subukan ang app →",
      ctaGhost: "Tingnan ang sample proof →",
    },
    footer: {
      tagline:
        "On-chain credential registry sa Stellar testnet. Ginawa para sa Stellar PH Bootcamp bootcamp.",
    },
    about: {
      lede: "One idea lang: certificates should be verifiable in seconds — hindi sa pamamagitan ng email. Tapos mabayaran agad.",
      problemKicker:
        "Real ang certificate niya. Pero proving it? Mas mahal pa kaysa mag-hire ng iba.",
      approachKicker:
        "Hindi lang na-verify ang credential — na-pay na rin si Maria. Sa iisang session. Yun ang punto.",
    },
    app: {
      connectTitle: "I-connect ang wallet mo para magsimula",
      connectSubtitle: "Mag-sign ng transactions gamit ang Freighter.",
      issuerLabel: "Issuer",
      issuerDesc: "Mag-issue at manage",
      employerLabel: "Employer",
      employerDesc: "Tingnan at bayaran",
      issuerRegisterTitle: "Mag-register ng certificate",
      issuerRegisterSubtitle:
        "I-upload ang PDF o i-paste ang 64-char hex hash. Ikaw ang mag-sign bilang issuer.",
      issuerDoneTitle: "Certificate registered na",
      issuerDoneSubtitle: "Tapos na ang trusted verification. Puwede nang i-check ng employer ang proof at bayaran ang student.",
      verifyTitle: "I-verify ang credential",
      verifySubtitle: "Hanapin muna, tapos gumamit ng approved issuer o admin wallet para mag-verify, suspend, o revoke.",
      employerWaitTitle: "Maghintay ng trusted verification",
      employerWaitSubtitle: "Puwedeng tingnan ng employer ang credential dito, pero payment lang kapag na-verify na ito ng approved issuer o admin.",
      payTitle: "Bayaran ang verified student",
      paySubtitle:
        "I-send ang payment amount na naka-link sa certificate na ito.",
      doneTitle: "Tapos na",
      doneSubtitle: "Handa na ang proof block para i-share.",
    },
  },
};
