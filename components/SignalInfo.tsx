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
    <div className="flex justify-between border-b border-slate-700 py-2">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
};

const SignalInfo: React.FC<SignalInfoProps> = ({ instrumentName }) => {
  const { instrumentInfo, loading, error } = useInstrumentInfo(instrumentName);
  const t = useTranslations("SignalInfo");

  if (loading) return <div>{t("loading")}</div>;
  if (error) return <div>{t("error")}</div>;

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
    <>
      <div className="h-full w-full rounded-2xl bg-slate-800 p-6 shadow-lg">
        <div className="flex flex-col gap-4">
          {" "}
          <div className="border-b border-slate-700 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-50">
                {instrument_name}
              </h2>
              <Link
                href={external_link || "#"}
                target="_blank"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
                <ExternalLink size={16} />
                <span className="text-sm">{t("exchange.link")}</span>
              </Link>
            </div>
            <p className="mt-2 text-lg text-slate-300">{full_name}</p>
            <p className="mt-1 text-sm text-slate-400">{basic_info}</p>
          </div>
          <div className="space-y-3">
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

            <div className="flex justify-between py-2">
              <span className="text-slate-400">
                {t("tradingInfo.volatility")}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  volatility_level === t("volatilityLevels.high")
                    ? "bg-red-500/20 text-red-400"
                    : volatility_level === t("volatilityLevels.medium")
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                }`}
              >
                {volatility_level}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignalInfo;
