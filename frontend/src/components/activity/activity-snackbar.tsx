"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivitySnackbarProps {
  children: ReactNode;
  autoHideMs?: number;
  revealDelayMs?: number;
  scrollOffsetPx?: number;
}

export function ActivitySnackbar({
  children,
  autoHideMs = 5200,
  revealDelayMs = 700,
  scrollOffsetPx = 320,
}: ActivitySnackbarProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const revealTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (dismissed || hasShown) return;

    function clearRevealTimer() {
      if (revealTimerRef.current != null) {
        window.clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    }

    function handleScroll() {
      if (window.scrollY < scrollOffsetPx) {
        clearRevealTimer();
        return;
      }
      if (revealTimerRef.current == null) {
        revealTimerRef.current = window.setTimeout(() => {
          setVisible(true);
          setHasShown(true);
          revealTimerRef.current = null;
        }, revealDelayMs);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearRevealTimer();
    };
  }, [dismissed, hasShown, revealDelayMs, scrollOffsetPx]);

  useEffect(() => {
    if (!visible || dismissed) return;
    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      setDismissed(true);
    }, autoHideMs);
    return () => {
      if (hideTimerRef.current != null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [autoHideMs, dismissed, visible]);

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "fixed right-4 bottom-6 z-50 w-80 max-sm:right-3 max-sm:left-3 max-sm:w-auto",
        "rounded-2xl bg-surface-glass border border-border-glass backdrop-blur-md shadow-glow-accent",
        "overflow-hidden",
        "transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-hidden={visible ? "false" : "true"}
    >
      <button
        type="button"
        className="absolute top-3 right-3 z-10 flex items-center justify-center w-6 h-6 rounded-md text-text-muted hover:text-text hover:bg-surface-2 transition-colors cursor-pointer"
        aria-label="Dismiss live activity"
        onClick={() => setDismissed(true)}
      >
        <X className="w-3.5 h-3.5" />
      </button>
      {children}
    </div>
  );
}

export default ActivitySnackbar;
