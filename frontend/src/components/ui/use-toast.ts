// frontend/src/components/ui/use-toast.ts
// Sonner-backed shim. Keeps the old { toast } = useToast() API working.
"use client";

import { toast as sonnerToast } from "sonner";

export type ToastTone = "success" | "danger" | "warning" | "neutral";

export interface ToastAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ToastInput {
  title: string;
  detail?: string;
  tone?: ToastTone;
  action?: ToastAction;
}

export function useToast() {
  function toast({ title, detail, tone, action }: ToastInput) {
    const message = detail ? `${title}: ${detail}` : title;
    const opts = action
      ? {
          action: {
            label: action.label,
            onClick: action.onClick ?? (() => { if (action.href) window.location.href = action.href; }),
          },
        }
      : undefined;

    if (tone === "success") sonnerToast.success(message, opts);
    else if (tone === "danger") sonnerToast.error(message, opts);
    else if (tone === "warning") sonnerToast.warning(message, opts);
    else sonnerToast(message, opts);
  }

  return { toast };
}
