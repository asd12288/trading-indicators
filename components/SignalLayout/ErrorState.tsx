"use client";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface ErrorStateProps {
  theme: string;
  id: string;
  errorMessage?: string;
  isDataNotFound?: boolean;
}

export default function ErrorState({
  theme,
  id,
  errorMessage,
  isDataNotFound = false,
}: ErrorStateProps) {
  const t = useTranslations("SignalLayout");

  return (
    <div className="mx-auto mb-8 flex max-w-7xl flex-col p-3 md:p-8 lg:p-12">
      <Link href="/smart-alerts">
        <div
          className={cn(
            "mb-6 flex cursor-pointer items-center gap-3 transition-colors duration-200",
            theme === "dark"
              ? "hover:text-primary"
              : "text-slate-700 hover:text-blue-600",
          )}
        >
          <ArrowLeft size={20} />
          <p className="text-lg font-medium">{t("allSignals")}</p>
        </div>
      </Link>

      <div
        className={cn(
          "flex w-full flex-col items-center gap-5 rounded-xl border p-6 shadow-lg backdrop-blur-sm",
          isDataNotFound
            ? theme === "dark"
              ? "border-blue-700/50 bg-blue-800/20"
              : "border-blue-200 bg-blue-50"
            : theme === "dark"
              ? "border-red-700/50 bg-red-800/20"
              : "border-red-200 bg-red-50",
        )}
      >
        {!isDataNotFound ? (
          <>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h2 className="text-xl font-medium text-red-500">
                Error Loading Signal Data
              </h2>
            </div>
            <p className="text-center">
              {errorMessage ||
                "Failed to load signal data. This instrument may not exist."}
            </p>
          </>
        ) : (
          <>
            <h2
              className={cn(
                "text-xl font-medium",
                theme === "dark" ? "text-white" : "text-slate-800",
              )}
            >
              No Signal Data Available for {id}
            </h2>
            <p className="text-center">
              We couldn't find any trading signals for this instrument. Please
              check back later or try another instrument.
            </p>
          </>
        )}

        <Link href="/smart-alerts">
          <button
            className={cn(
              "mt-4 rounded-md border px-4 py-2",
              theme === "dark"
                ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
            )}
          >
            {isDataNotFound ? "Browse All Signals" : "Return to All Signals"}
          </button>
        </Link>
      </div>
    </div>
  );
}
