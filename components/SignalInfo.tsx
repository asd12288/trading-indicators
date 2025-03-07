import useInstrumentInfo from "@/hooks/useInstrumentInfo";
import React from "react";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { InstrumentInfo } from "@/lib/types";

interface InfoRowProps {
  label: string;
  value?: string;
}

interface SignalInfoProps {
  instrumentName: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  return (
    <div className="group flex justify-between border-b border-slate-700/50 py-3">
      <span className="text-slate-400 transition-colors duration-200 group-hover:text-slate-300">
        {label}
      </span>
      <span className="font-medium text-slate-200">{value}</span>
    </div>
  );
};

const SignalInfo: React.FC<SignalInfoProps> = ({ instrumentName }) => {
  const { instrumentInfo, loading, error } = useInstrumentInfo(instrumentName);
  const t = useTranslations("SignalInfo");

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center p-8">
        <div className="flex animate-pulse space-x-4">
          <div className="h-4 w-4 rounded-full bg-slate-600"></div>
          <div className="h-4 w-4 rounded-full bg-slate-600"></div>
          <div className="h-4 w-4 rounded-full bg-slate-600"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-slate-400">
        <p>{t("error")}</p>
      </div>
    );

  const {
    instrument_name,
    full_name,
    basic_info,
    exchange,
    trading_hours,
    contract_size,
    tick_size,
    tick_value,
    volatility_level,
    external_link,
  } = instrumentInfo as InstrumentInfo;

  return (
    <div className="h-full w-full p-6">
      <div className="flex flex-col gap-4">
        <div className="border-b border-slate-700/50 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
              {instrument_name}
            </h2>
            <Link
              href={external_link || "#"}
              target="_blank"
              className="flex items-center gap-2 rounded-full bg-slate-700/40 px-3 py-1.5 text-blue-400 transition-colors duration-200 hover:text-blue-300"
            >
              <ExternalLink size={14} />
              <span className="text-xs font-medium">{t("exchange.link")}</span>
            </Link>
          </div>
          <p className="mt-2 text-lg font-light text-slate-300">{full_name}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {basic_info}
          </p>
        </div>
        <div className="space-y-3 pt-2">
          <InfoRow label={t("exchange.label")} value={exchange} />
          <InfoRow
            label={t("tradingInfo.tradingHours")}
            value={trading_hours}
          />
          <InfoRow
            label={t("tradingInfo.contractSize")}
            value={contract_size}
          />
          <InfoRow label={t("tradingInfo.tickSize")} value={tick_size} />
          <InfoRow label={t("tradingInfo.tickValue")} value={tick_value} />

          <div className="flex items-center justify-between py-3">
            <span className="text-slate-400">
              {t("tradingInfo.volatility")}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                volatility_level === t("volatilityLevels.high")
                  ? "border border-red-500/30 bg-red-900/30 text-red-300"
                  : volatility_level === t("volatilityLevels.medium")
                    ? "border border-yellow-500/30 bg-yellow-900/30 text-yellow-300"
                    : "border border-green-500/30 bg-green-900/30 text-green-300"
              }`}
            >
              {volatility_level}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalInfo;
