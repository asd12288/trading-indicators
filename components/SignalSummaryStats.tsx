import {
  BarChart3,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const SignalSummaryStats = ({ data }) => {
  const t = useTranslations("SignalOverviewSummary");

  if (!data || data.length === 0) {
    return <div>{t("noData") || "No Data Available"}</div>;
  }

  // Get current date and subtract 7 days
  const now = new Date();
  const lastWeekStart = new Date();
  lastWeekStart.setDate(now.getDate() - 7);

  // Filter trades that were entered in the last 7 days
  const lastWeekTrades = data.filter((trade) => {
    const entryDate = new Date(trade.entry_time);
    return entryDate >= lastWeekStart && entryDate <= now;
  });

  // Calculate summary statistics for last week's trades
  const totalTrades = lastWeekTrades.length;
  const totalMFE = lastWeekTrades.reduce((acc, trade) => acc + trade.mfe, 0);
  const avgMFE = totalTrades > 0 ? (totalMFE / totalTrades).toFixed(2) : 0;

  const losingTrades = lastWeekTrades.filter((trade) => trade.result_ticks < 0);
  const totalLoss = losingTrades.reduce(
    (acc, trade) => acc + trade.result_ticks,
    0,
  );
  const avgLoss =
    losingTrades.length > 0 ? (totalLoss / losingTrades.length).toFixed(2) : 0;

  const summary = {
    totalTrades,
    totalMFE: totalMFE.toFixed(2),
    avgMFE,
    totalLoss: totalLoss.toFixed(2),
    avgLoss,
  };

  return (
    <div className="rounded-xl bg-slate-800 p-4">
      <h2 className="mb-4 flex items-center gap-2 ms:text-xl  font-semibold text-slate-100">
        <BarChart3 size={20} className="text-purple-400" />
        {t("summary.title") || "Signal Summary (Last Week)"}
      </h2>

      <div className="flex justify-between gap-4">
        {/* Total Trades */}
        <div className="rounded-lg bg-slate-700/50 md:p-4 p-2 w-full">
          <div className="mb-1 flex items-center gap-2 text-gray-400">
            <CheckCircle2 size={16} />
            <span>{t("summary.totalTrades") || "Total Trades"}</span>
          </div>
          <p className="md:text-2xl text-lg font-bold text-white">{summary.totalTrades}</p>
        </div>

        {/* MFE Stats */}
        <div className="rounded-lg bg-slate-700/50 md:p-4 p-2 w-full">
          <div className="mb-1 flex items-center gap-2 text-green-400">
            <TrendingUp size={16} />
            <span>{t("summary.totalMFETicks") || "Total MFE Ticks"}</span>
          </div>
          <p className="md:text-2xl text-lg font-bold text-white">{summary.totalMFE}</p>
          <p className="mt-1 text-sm text-gray-400">
            <span className="font-medium text-green-400">
              {t("summary.avgMFETicks") || "Avg"}:{" "}
            </span>
            {summary.avgMFE}
          </p>
        </div>

        {/* Loss Stats */}
        <div className="rounded-lg bg-slate-700/50 md:p-4 p-2 w-full">
          <div className="mb-1 flex items-center gap-2 text-red-400">
            <TrendingDown size={16} />
            <span>{t("summary.totalLossTicks") || "Total Loss Ticks"}</span>
          </div>
          <p className="md:text-2xl text-lg font-bold text-white">{summary.totalLoss}</p>
          <p className="mt-1 text-sm text-gray-400">
            <span className="font-medium text-red-400">
              {t("summary.avgLossTicks") || "Avg"}:{" "}
            </span>
            {summary.avgLoss}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignalSummaryStats;
