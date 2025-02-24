import useInstrumentInfo from "@/hooks/useInstrumentInfo";
import React from "react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-slate-700 py-2">
    <span className="text-slate-400">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const SignalInfo = ({ instrumentName }) => {
  const { instrumentInfo, loading, error } = useInstrumentInfo(instrumentName);

  if (loading) return <div>Loading instrument info...</div>;
  if (error) return <div>Error loading instrument info</div>;

  return (
    <>
      <div className="mb-6 border-b border-slate-700 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-50">
            {instrumentInfo.instrument_name}
          </h2>
          <Link
            href={instrumentInfo.external_link}
            target="_blank"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <ExternalLink size={16} />
            <span className="text-sm">Exchange</span>
          </Link>
        </div>
        <p className="mt-2 text-lg text-slate-300">
          {instrumentInfo.full_name}
        </p>
        <p className="mt-1 text-sm text-slate-400">
          {instrumentInfo.basic_info}
        </p>
      </div>

      {/* Trading Info Grid */}
      <div className="space-y-3">
        <InfoRow label="Exchange" value={instrumentInfo.exchange} />
        <InfoRow label="Trading Hours" value={instrumentInfo.trading_hours} />
        <InfoRow label="Contract Size" value={instrumentInfo.contract_size} />
        <InfoRow label="Tick Size" value={instrumentInfo.tick_size} />
        <InfoRow label="Tick Value" value={instrumentInfo.tick_value} />

        <div className="flex justify-between py-2">
          <span className="text-slate-400">Volatility</span>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              instrumentInfo.volatility_level === "High"
                ? "bg-red-500/20 text-red-400"
                : instrumentInfo.volatility_level === "Medium"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-green-500/20 text-green-400"
            }`}
          >
            {instrumentInfo.volatility_level}
          </span>
        </div>
      </div>
    </>
  );
};

export default SignalInfo;
