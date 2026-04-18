"use client";
import { motion } from "framer-motion";

export function HeroOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Amber orb — top-left */}
      <motion.div
        className="absolute -top-24 -left-16 w-[480px] h-[480px] rounded-full bg-primary/10 blur-[120px]"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Violet orb — bottom-right */}
      <motion.div
        className="absolute -bottom-32 -right-20 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px]"
        animate={{ y: [0, 16, 0], x: [0, -12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
    </div>
  );
}
