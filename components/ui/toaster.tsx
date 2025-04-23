"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        data,
        icon,
        ...props
      }) {
        // Check if this is a trade notification
        const isTrade =
          (typeof title === "string" &&
            (title.includes("Signal") ||
              title.includes("Buy") ||
              title.includes("Sell"))) ||
          data?.type === "trade";

        const isBuy =
          (typeof title === "string" && title.includes("Buy")) ||
          data?.isBuy === true;

        return (
          <Toast key={id} {...props} data={data}>
            <div className="flex items-start gap-3">
              {/* Display appropriate icon for trade notifications */}
              {isTrade ? (
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-800">
                  {isBuy ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
              ) : icon ? (
                <div className="mt-0.5 flex-shrink-0">{icon}</div>
              ) : null}

              <div className="grid flex-1 gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
