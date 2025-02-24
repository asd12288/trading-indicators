"use client";

import React from "react";
import SignalCard from "./SignalCard/SignalCard";
import { useSignalStatus } from "@/hooks/useSignalStatus";
import { useTranslations } from "next-intl";

const SignalOverview = ({ signalPassed, instrumentData }) => {
  const instrumentName = instrumentData[0].instrument_name;
  const t = useTranslations("SignalOverview");

  const { InstrumentStatus, loading, error } = useSignalStatus(instrumentName);

  if (!signalPassed) {
    return <div>{t("noData")}</div>;
  }

  return (
    <div className="flex flex-col space-y-4">
      {loading ? (
        <h2>{t("loading")}</h2>
      ) : (
        <div className="mb-4">
          <h2 className="flex justify-between text-xl font-semibold text-slate-100">
            {t("status.title")}{" "}
            <span>
              {InstrumentStatus?.isActive
                ? t("status.active")
                : t("status.inactive")}
            </span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {t("status.lastUpdate", { time: InstrumentStatus?.displayTime })}
          </p>
        </div>
      )}
      <SignalCard signalPassed={signalPassed} />
    </div>
  );
};

export default SignalOverview;
