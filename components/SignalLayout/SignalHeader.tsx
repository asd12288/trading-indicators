"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import SignalTool from "@/components/SignalCard/SignalTool";

interface SignalHeaderProps {
  theme: string;
  id: string;
  userId: string;
  isPro: boolean;
  tradeId?: string | null;
}

export default function SignalHeader({ theme, id, userId, isPro, tradeId }: SignalHeaderProps) {
  const t = useTranslations("SignalLayout");

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-5 rounded-xl border p-6 shadow-lg backdrop-blur-sm md:flex-row md:items-center md:justify-between",
        theme === "dark"
          ? "border-slate-700/50 bg-slate-800/90"
          : "border-slate-200 bg-white",
      )}
    >
      <div className="flex items-center">
        <h2
          className={cn(
            "relative text-left text-2xl font-light md:text-3xl",
            theme === "dark" ? "text-white" : "text-slate-800",
          )}
        >
          {t("signal")}{" "}
          <span className="text-primary font-semibold">{id}</span>
          {tradeId && (
            <span className="ml-2 text-sm text-slate-400">
              (Trade ID: {tradeId.substring(0, 6)}...)
            </span>
          )}
        </h2>
        <div className="ml-4"></div>
      </div>

      <div className="flex items-center gap-4">
        <h4
          className={cn(
            "text-sm font-medium md:text-base",
            theme === "dark" ? "text-slate-300" : "text-slate-600",
          )}
        >
          {isPro ? t("signalSettings") : t("upgradeMessage")}
        </h4>

        <SignalTool signalId={id} userId={userId} isPro={isPro} />
      </div>
    </div>
  );
}