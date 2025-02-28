"use client";

import { useSignalStatus } from "@/hooks/useSignalStatus";
import React from "react";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";

const SignalStatusBar = ({ instrumentName }) => {
  const { InstrumentStatus, loading, error } = useSignalStatus(instrumentName);
  const t = useTranslations("SignalOverviewSummary");

  return loading ? (
    <div>Loading</div>
  ) : (
    <div className="rounded-xl bg-slate-800/50 p-4">
      <h2 className="flex items-center justify-between text-center font-semibold text-slate-100 md:text-xl">
        <div className="flex items-center justify-between gap-4">
          <Clock size={20} className="text-blue-400" />
          {t("status.title")}
        </div>
        <span
          className={`ml-2 rounded-full px-3 py-1 text-xs font-medium md:text-sm ${
            InstrumentStatus?.isActive
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {InstrumentStatus?.isActive
            ? t("status.active")
            : t("status.inactive")}
        </span>
      </h2>
      <p className="mt-2 text-center text-xs text-gray-400 md:text-sm">
        {t("status.lastUpdate", { time: InstrumentStatus?.displayTime })}
      </p>
    </div>
  );
};

export default SignalStatusBar;
