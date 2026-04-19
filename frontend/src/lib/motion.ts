// frontend/src/lib/motion.ts
// Reusable Framer Motion variants + DeFi easing for consistent animations.

import type { TargetAndTransition } from "framer-motion";

export const EASE_DEFI = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ease: EASE_DEFI, duration: 0.5 } },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { ease: EASE_DEFI, duration: 0.4 } },
};

export const scaleIn = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { ease: EASE_DEFI, duration: 0.4 } },
};

export const cardHover = {
  rest: { y: 0, boxShadow: "none" },
  hover: {
    y: -2,
    boxShadow: "0 0 24px rgba(139,92,246,0.35)",
    transition: { ease: EASE_DEFI, duration: 0.25 },
  },
};

export const glowPulse: { animate: TargetAndTransition } = {
  animate: {
    scale: [1, 1.4, 1],
    opacity: [1, 0.5, 1],
    transition: { duration: 2, repeat: Infinity, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const ctaHover = {
  rest: { scale: 1, boxShadow: "0 4px 14px rgba(245,158,11,0.15)" },
  hover: {
    scale: 1.02,
    boxShadow: "0 4px 32px rgba(245,158,11,0.45), 0 0 64px rgba(245,158,11,0.15)",
    transition: { ease: EASE_DEFI, duration: 0.2 },
  },
};
