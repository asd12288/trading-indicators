import { Signal } from "@/lib/types";
import { format, formatDistance, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import {
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface FufilledSignalCardProps {
  instrument: Signal;
  isBuy: boolean;
}

const FufilledSignalCard: React.FC<FufilledSignalCardProps> = ({
  instrument,
  isBuy,
}) => {
  const {
    instrument_name,
    trade_side,
    entry_price,
    exit_price,
    entry_time,
    exit_time,
    mae,
    mfe,
  } = instrument;

  const t = useTranslations("FufilledSignalCard");

  // Early validation
  if (!exit_time || !entry_time || !entry_price || !exit_price) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-yellow-500 bg-yellow-950/10 p-3 text-center">
        <XCircle className="h-6 w-6 text-yellow-500" />
        <p className="mt-1 text-xs text-slate-400">
          Incomplete data for {instrument_name}
        </p>
      </div>
    );
  }

  // Format numbers consistently
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 5,
    }).format(num);
  };

  // Process data
  const start = parseISO(entry_time);
  const end = parseISO(exit_time);
  const tradeDuration = formatDistance(start, end, { includeSeconds: true });

  // Calculate profit/loss
  const priceDiff = exit_price - entry_price;
  const isProfitable = isBuy ? priceDiff > 0 : priceDiff < 0;

  return (
    <div className="h-full">
      <div
        className={cn(
          "h-full rounded-lg border-t-4 bg-slate-900 shadow-md transition-all hover:shadow-lg",
          isBuy ? "border-t-emerald-500" : "border-t-rose-500",
        )}
      >
        {/* Status badge */}
        <div className="relative">
          <div
            className={cn(
              "absolute right-3 top-3 rounded-full px-2 py-1 text-xs font-medium",
              isProfitable
                ? "bg-blue-500/20 text-blue-400"
                : "bg-amber-500/20 text-amber-400",
            )}
          >
            {isProfitable ? t("win") : t("loss")}
          </div>
        </div>

        {/* Card header */}
        <div className="p-4">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">{instrument_name}</h3>
            <Badge
              className={cn(
                "text-xs font-medium",
                isBuy
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700",
              )}
            >
              {trade_side}
            </Badge>
          </div>

          <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            <span>{format(parseISO(entry_time), "MMM d, HH:mm")}</span>
            <span>•</span>
            <span>{tradeDuration}</span>
          </div>

          {/* MFE Highlight - Trade Potential */}
          <div className="mb-4 overflow-hidden rounded-md bg-slate-800">
            <div className="border-b border-slate-700 bg-slate-700/30 px-3 py-2">
              <span className="text-sm font-medium text-slate-300">
                {t("tradePotential")}
              </span>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-medium text-slate-300">
                    {t("mfe")}
                  </span>
                </div>
                <div className="text-xl font-bold text-emerald-400">
                  {formatNumber(mfe)}
                </div>
              </div>

              {/* Visual representation of MFE vs MAE */}
              <div className="mt-3 h-2 rounded-full bg-slate-700">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{
                    width: `${Math.min(Math.max((mfe / (mfe + mae)) * 100, 10), 90)}%`,
                  }}
                ></div>
              </div>
              <div className="mt-1.5 flex justify-between text-xs text-slate-400">
                <span>{t("entry")}</span>
                <span>{t("maximum")}</span>
              </div>
            </div>
          </div>

          {/* Price data */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-400">{t("entryPrice")}</div>
              <div className="text-sm font-medium text-white">
                {formatNumber(entry_price)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400">{t("exitPrice")}</div>
              <div className="text-sm font-medium text-white">
                {formatNumber(exit_price)}
              </div>
            </div>
          </div>
        </div>

        {/* MFE and MAE metrics */}
        <div className="grid grid-cols-2 gap-2 border-t border-slate-800 p-3">
          <div className="flex flex-col rounded-md bg-slate-800 p-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-slate-400">{t("mfe")}</span>
            </div>
            <span className="mt-1 text-lg font-bold text-emerald-400">
              {formatNumber(mfe)}
            </span>
            <span className="mt-0.5 text-xs text-slate-500">
              {t("potentialGain")}
            </span>
          </div>

          <div className="flex flex-col rounded-md bg-slate-800 p-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-rose-500"></div>
              <span className="text-xs text-slate-400">{t("mae")}</span>
            </div>
            <span className="mt-1 text-sm font-medium text-rose-400">
              {formatNumber(mae)}
            </span>
            <span className="mt-0.5 text-xs text-slate-500">
              {t("maxAdversity")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FufilledSignalCard;
