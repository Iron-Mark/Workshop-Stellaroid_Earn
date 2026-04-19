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
    const opts = {
      description: detail,
      ...(action
        ? {
            action: {
              label: action.label,
              onClick: action.onClick ?? (() => { if (action.href) window.location.href = action.href; }),
            },
          }
        : {}),
    };

    if (tone === "success") sonnerToast.success(title, opts);
    else if (tone === "danger") sonnerToast.error(title, opts);
    else if (tone === "warning") sonnerToast.warning(title, opts);
    else sonnerToast(title, opts);
  }

  return { toast };
}
