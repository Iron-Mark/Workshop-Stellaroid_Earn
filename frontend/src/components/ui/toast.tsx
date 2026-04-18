"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./toast.module.css";
import type { ToastInput, ToastTone, ToastAction } from "./use-toast";

export type { ToastTone, ToastInput, ToastAction };

const MAX_TOASTS = 4;
const AUTO_DISMISS_MS = 5000;

interface ToastItem extends ToastInput {
  id: number;
  exiting: boolean;
}

interface ToastContextValue {
  toast: (input: ToastInput) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: number) => {
    // Mark as exiting first for fade-out animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 150);
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = ++counter.current;
      const item: ToastItem = { ...input, id, exiting: false };

      setToasts((prev) => {
        const next = [...prev, item];
        // If over max, mark oldest for removal
        if (next.length > MAX_TOASTS) {
          return next.slice(next.length - MAX_TOASTS);
        }
        return next;
      });

      const timer = setTimeout(() => removeToast(id), AUTO_DISMISS_MS);
      timers.current.set(id, timer);
    },
    [removeToast]
  );

  // Clear all timers on unmount
  useEffect(() => {
    const t = timers.current;
    return () => {
      t.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className={styles.region}
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} item={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) {
  const tone: ToastTone = item.tone ?? "neutral";

  const toastClass = [
    styles.toast,
    styles[tone],
    item.exiting ? styles.exiting : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={toastClass} role="status">
      <div className={styles.body}>
        <span className={styles.title}>{item.title}</span>
        {item.detail && <p className={styles.detail}>{item.detail}</p>}
        {item.action && (
          <div className={styles.action}>
            {item.action.href ? (
              <a
                href={item.action.href}
                className={styles.actionLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.action.label}
              </a>
            ) : (
              <button
                type="button"
                className={styles.actionBtn}
                onClick={item.action.onClick}
              >
                {item.action.label}
              </button>
            )}
          </div>
        )}
      </div>
      <button
        type="button"
        className={styles.dismiss}
        aria-label="Dismiss"
        onClick={onDismiss}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M1.5 1.5L12.5 12.5M12.5 1.5L1.5 12.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default ToastProvider;
