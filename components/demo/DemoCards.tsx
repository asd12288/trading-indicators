"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";
import {
  ArrowUp,
  ArrowDown,
  Clock,
  Zap,
  Target,
  DollarSign,
  Award,
  Bell,
  Globe,
  Calendar,
} from "lucide-react";
import { useTranslations } from "next-intl";

type DemoCardType = "running" | "fulfilled" | "marketClosed" | "systemClosed";

interface DemoCardProps {
  type: DemoCardType;
  instrumentName?: string;
  tradeSide?: "Long" | "Short";
}

// Market data with realistic pricing based on actual market values as of May 2024
const instrumentData = {
  ES: {
    fullName: "E-mini S&P 500 Future",
    basePrice: 5266.75,
    tickSize: 0.25,
    tickValue: 12.5,
    profitTarget: 20, // ticks
    stopLoss: 8, // ticks
    volatilityRange: 0.5, // percentage
    format: "futures",
    priceHistory: [
      5266.75, 5267.0, 5267.25, 5266.5, 5266.75, 5267.5, 5268.0, 5267.75,
    ],
    typicalDailyRange: 32, // points
  },
  NQ: {
    fullName: "E-mini Nasdaq-100 Future",
    basePrice: 18654.25,
    tickSize: 0.25,
    tickValue: 5.0,
    profitTarget: 42, // ticks (10.5 points)
    stopLoss: 24, // ticks (6 points)
    volatilityRange: 0.8, // higher volatility than ES
    format: "futures",
    averageDailyRange: 180, // points
    typicalMFE: 35, // ticks
    typicalMAE: 18, // ticks
    priceHistory: [
      18654.25, 18656.5, 18657.75, 18655.25, 18653.0, 18654.5, 18656.25,
      18655.75,
    ],
  },
  EURUSD: {
    fullName: "Euro/US Dollar",
    basePrice: 1.07732,
    tickSize: 0.00001, // 0.1 pip
    tickValue: 1.0, // $1 per pip (assuming 0.1 lot)
    profitTarget: 45, // pips
    stopLoss: 25, // pips
    volatilityRange: 0.4,
    format: "forex",
    averageDailyRange: 80, // pips
    typicalMFE: 38, // pips
    typicalMAE: 15, // pips
    priceHistory: [
      1.07732, 1.07741, 1.07752, 1.07738, 1.07726, 1.07737, 1.07745, 1.07731,
    ],
    decimalPlaces: 5,
  },
};

export default function DemoCard({
  type,
  instrumentName = "NQ",
  tradeSide = "Long",
}: DemoCardProps) {
  // Add translations from real cards
  const runningT = useTranslations("RunningSignalCard");
  const fulfilledT = useTranslations("FufilledSignalCard");
  const marketT = useTranslations("MarketClosedCard");
  const systemT = useTranslations("SystemClosedCard");
  const demoT = useTranslations("DemoCard");

  const { theme } = useTheme();
  const isBuy = tradeSide === "Long";
  const animationIndexRef = useRef(0);
  const lastUpdateTimeRef = useRef<Date>(new Date());
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  // Get instrument-specific data
  const instrument =
    instrumentName in instrumentData
      ? instrumentData[instrumentName]
      : instrumentData.NQ;

  // Initialize prices based on instrument data
  const entryPrice = instrument.basePrice;
  const targetTicks = instrument.profitTarget;
  const stopTicks = instrument.stopLoss;

  // Calculate target and stop prices based on direction
  const targetPrice = isBuy
    ? entryPrice + targetTicks * instrument.tickSize
    : entryPrice - targetTicks * instrument.tickSize;

  const stopPrice = isBuy
    ? entryPrice - stopTicks * instrument.tickSize
    : entryPrice + stopTicks * instrument.tickSize;

  // For running cards, simulate price movement with more realism
  const [currentPrice, setCurrentPrice] = useState(() => {
    // Initialize with realistic price based on current instrument
    return isBuy
      ? entryPrice + targetTicks * instrument.tickSize * 0.35
      : entryPrice - targetTicks * instrument.tickSize * 0.35;
  });

  // Reset the current price when the instrument changes to prevent flashing
  useEffect(() => {
    // This ensures we immediately reset to the correct starting price for the new instrument
    animationIndexRef.current = 0;
    setCurrentPrice(
      isBuy
        ? entryPrice + targetTicks * instrument.tickSize * 0.35
        : entryPrice - targetTicks * instrument.tickSize * 0.35,
    );

    // Update the last update time to show fresh data
    const now = new Date();
    lastUpdateTimeRef.current = now;
    setLastUpdateTime(now);
  }, [
    instrumentName,
    tradeSide,
    entryPrice,
    targetTicks,
    instrument.tickSize,
    isBuy,
  ]);

  // Simulate realistic price movement with noise and trending
  useEffect(() => {
    if (type !== "running") return;

    const interval = setInterval(
      () => {
        setCurrentPrice((prevPrice) => {
          // Get next price from history or simulate a new realistic movement
          const priceHistory = instrument.priceHistory || [];

          // If we have history data, use it in a cycle for realistic patterns
          if (priceHistory.length > 0) {
            animationIndexRef.current =
              (animationIndexRef.current + 1) % priceHistory.length;
            const nextHistoricalPrice = priceHistory[animationIndexRef.current];

            // Add some random noise to the historical price for variation
            const noiseAmount = instrument.tickSize * (Math.random() * 4 - 2); // -2 to +2 ticks
            const nextPrice = nextHistoricalPrice + noiseAmount;

            // Update last price timestamp
            lastUpdateTimeRef.current = new Date();
            setLastUpdateTime(lastUpdateTimeRef.current);

            return nextPrice;
          }

          // Fallback to simulated movement if no history
          const volatilityFactor =
            instrument.volatilityRange * instrument.tickSize;
          const trend = isBuy ? 0.1 : -0.1; // slight bias in direction of trade
          const noise = (Math.random() - 0.5) * volatilityFactor;

          let newPrice = prevPrice + noise + trend;

          // Ensure price stays within realistic bounds
          const rangeLimitUpper = isBuy ? targetPrice * 0.95 : stopPrice * 0.95;
          const rangeLimitLower = isBuy ? stopPrice * 1.05 : targetPrice * 1.05;

          if (
            (isBuy && newPrice > rangeLimitUpper) ||
            (!isBuy && newPrice < rangeLimitLower)
          ) {
            // Reverse movement direction when approaching limits (mean reversion)
            newPrice = prevPrice - noise * 2;
          }

          // Update last price timestamp
          lastUpdateTimeRef.current = new Date();
          setLastUpdateTime(lastUpdateTimeRef.current);

          // Format to correct decimal places for the instrument type
          const decimalPlaces =
            instrument.format === "forex" ? instrument.decimalPlaces || 5 : 2;

          return parseFloat(newPrice.toFixed(decimalPlaces));
        });
      },
      1250 + Math.random() * 500,
    ); // Randomize update timing slightly for realism

    return () => clearInterval(interval);
  }, [
    type,
    isBuy,
    targetPrice,
    stopPrice,
    instrument.tickSize,
    instrument.volatilityRange,
    instrument.format,
    instrument.priceHistory,
    instrument.decimalPlaces,
    instrumentName, // Add instrumentName dependency to re-trigger effect when it changes
  ]);

  // Format numbers based on instrument type
  const formatNumber = (num: number) => {
    if (instrument.format === "forex") {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: instrument.decimalPlaces || 5,
        maximumFractionDigits: instrument.decimalPlaces || 5,
      }).format(num);
    }

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatDollar = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate position for price scale (0-100%)
  const calculatePosition = (price: number) => {
    const range = Math.abs(targetPrice - stopPrice);
    if (range === 0) return 50;

    const position = ((price - stopPrice) / range) * 100;
    return Math.max(0, Math.min(100, position)); // Clamp between 0-100
  };

  const entryPosition = calculatePosition(entryPrice);
  const currentPosition = calculatePosition(currentPrice);

  // Calculate performance metrics for display
  const priceDifference = Math.abs(currentPrice - entryPrice);

  // Format performance percentage based on instrument type
  const performancePercentage =
    instrument.format === "forex"
      ? ((priceDifference / entryPrice) * 10000).toFixed(1) // Show in pips for forex
      : ((priceDifference / entryPrice) * 100).toFixed(2); // Show in percent for futures

  // Calculate ticks/pips with correct rounding
  const ticksDifference = Math.round(priceDifference / instrument.tickSize);
  const dollarValue = Math.round(ticksDifference * instrument.tickValue);
  const isProfitable = isBuy
    ? currentPrice > entryPrice
    : currentPrice < entryPrice;

  // For fulfilled cards, use realistic MFE/MAE values
  const mfeTicks =
    instrument.typicalMFE || Math.round(instrument.profitTarget * 0.85);
  const mfeDollarValue = Math.round(mfeTicks * instrument.tickValue);
  const maeTicks =
    instrument.typicalMAE || Math.round(instrument.stopLoss * 0.4);

  // Calculate risk-reward ratio
  const riskReward = (instrument.profitTarget / instrument.stopLoss).toFixed(1);

  // Format last update time
  const getTimeSinceUpdate = () => {
    const now = new Date();
    const diff = now.getTime() - lastUpdateTime.getTime();

    if (diff < 1000) return "just now";
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    return `${Math.floor(diff / 60000)}m ago`;
  };

  // For forex, use "pips" instead of "ticks"
  const tickLabel = instrument.format === "forex" ? "pips" : "ticks";

  // Demo cards components
  const renderRunningCard = () => (
    <div className="h-full">
      <div
        className={cn(
          "h-full overflow-hidden rounded-lg border shadow-md transition-all hover:shadow-lg",
          isBuy ? "border-emerald-500" : "border-rose-500",
          theme === "dark" ? "bg-slate-900" : "bg-white",
        )}
      >
        <div
          className={cn(
            "py-1.5 text-center text-sm font-semibold text-white",
            isBuy ? "bg-emerald-600" : "bg-rose-600",
          )}
        >
          {runningT("liveTracking")}
        </div>

        <div className="p-4">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  "text-4xl font-bold",
                  theme === "dark" ? "text-white" : "text-slate-900",
                )}
              >
                {instrumentName}
              </h3>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-md border px-2 py-1 text-xs",
                  isBuy
                    ? "border-emerald-500/30 bg-emerald-900/10 text-emerald-400"
                    : "border-rose-500/30 bg-rose-900/10 text-rose-400",
                )}
              >
                {isBuy ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {isBuy ? runningT("long") : runningT("short")}
              </div>
            </div>
            <div className="mt-1 text-sm text-slate-400">
              {instrument.fullName}
            </div>
          </div>

          {/* Time info - with last update time */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {runningT("started")} 45 {runningT("tradeDuration")}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {runningT("lastUpdate")}:{" "}
              <span className="text-blue-400">{getTimeSinceUpdate()}</span>
            </div>
          </div>

          {/* Current Price - with animation */}
          <div
            className={cn(
              "mb-4 rounded-lg border-2 p-4",
              theme === "dark" ? "bg-slate-800" : "bg-slate-50",
              isProfitable ? "border-emerald-500/50" : "border-rose-500/50",
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">
                  {runningT("currentPrice")}
                </span>
                <span className="ml-1.5 rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {runningT("live")}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="mb-0.5 text-xs text-slate-400">
                  {runningT("livePosition")}
                </div>
                <div
                  className={cn(
                    "text-sm font-medium",
                    isProfitable ? "text-emerald-400" : "text-rose-400",
                  )}
                >
                  {isProfitable ? "+" : "-"}
                  {formatNumber(priceDifference)}
                </div>
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div
                key={`${instrumentName}-${currentPrice}`}
                className="animate-pulse text-3xl font-bold tracking-tight"
              >
                {formatNumber(currentPrice)}
              </div>
              <div
                className={cn(
                  "text-lg font-medium",
                  isProfitable ? "text-emerald-400" : "text-rose-400",
                )}
              >
                {isProfitable ? "+" : "-"}
                {instrument.format === "forex"
                  ? `${performancePercentage} pips`
                  : `${performancePercentage}%`}
              </div>
            </div>

            {/* Ticks/Pips and dollar value */}
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {ticksDifference} {tickLabel} ({formatDollar(dollarValue)})
              </span>
              <span className="text-slate-400">
                {runningT("riskReward")}: 1:{riskReward}
              </span>
            </div>
          </div>

          {/* Key prices in a grid */}
          <div className="mb-5 grid grid-cols-3 gap-2">
            {/* Entry Price */}
            <div
              className={cn(
                "rounded-md p-2",
                theme === "dark" ? "bg-slate-800" : "bg-slate-100",
              )}
            >
              <div className="text-xs text-slate-400">{runningT("entry")}</div>
              <div className="font-medium">{formatNumber(entryPrice)}</div>
            </div>

            {/* Target Price */}
            <div
              className={cn(
                "rounded-md p-2",
                theme === "dark" ? "bg-emerald-900/20" : "bg-emerald-50",
                theme === "dark" ? "text-emerald-400" : "text-emerald-600",
              )}
            >
              <div className="text-xs opacity-80">{runningT("target")}</div>
              <div className="font-medium">{formatNumber(targetPrice)}</div>
              <div className="mt-0.5 text-xs opacity-80">
                {isBuy ? "+" : "-"}
                {instrument.profitTarget} {tickLabel}
              </div>
            </div>

            {/* Stop Loss */}
            <div
              className={cn(
                "rounded-md p-2",
                theme === "dark" ? "bg-rose-900/20" : "bg-rose-50",
                theme === "dark" ? "text-rose-400" : "text-rose-600",
              )}
            >
              <div className="text-xs opacity-80">{runningT("stop")}</div>
              <div className="font-medium">{formatNumber(stopPrice)}</div>
              <div className="mt-0.5 text-xs opacity-80">
                {isBuy ? "-" : "+"}
                {instrument.stopLoss} {tickLabel}
              </div>
            </div>
          </div>

          {/* Price scale visualization */}
          <div className="mb-5">
            <div className="relative h-8 rounded-lg bg-slate-400 dark:bg-slate-700">
              {/* Progress range for entry */}
              <div
                className={cn(
                  "absolute bottom-0 left-0 top-0 opacity-20",
                  isBuy ? "bg-emerald-500" : "bg-rose-600",
                )}
                style={{ width: `${entryPosition}%` }}
              />

              {/* Progress from entry to current */}
              <div
                className={cn(
                  "absolute bottom-0 top-0 opacity-40",
                  isProfitable ? "bg-emerald-500" : "bg-rose-600",
                )}
                style={{
                  left: `${Math.min(entryPosition, currentPosition)}%`,
                  width: `${Math.abs(currentPosition - entryPosition)}%`,
                }}
              />

              {/* Stop Loss marker */}
              <div className="absolute bottom-0 left-0 top-0 flex items-center">
                <div className="h-8 w-2 rounded-l-lg bg-rose-600" />
              </div>

              {/* Entry price marker */}
              <div
                className="absolute bottom-0 top-0 z-10 flex items-center"
                style={{
                  left: `calc(${entryPosition}% - 1.5px)`,
                }}
              >
                <div className="h-8 w-3 bg-blue-500" />
              </div>

              {/* Current price marker - with subtle animation */}
              <div
                className="absolute bottom-0 top-0 z-20 flex items-center transition-all duration-1000 ease-in-out"
                style={{
                  left: `calc(${currentPosition}% - 1px)`,
                }}
              >
                <div className="h-8 w-2 bg-amber-500" />
              </div>

              {/* Take profit marker */}
              <div className="absolute bottom-0 right-0 top-0 flex items-center">
                <div className="h-8 w-2 rounded-r-lg bg-emerald-600" />
              </div>
            </div>

            {/* Scale labels */}
            <div className="mt-1 flex justify-between text-xs">
              <div className="flex flex-col items-start">
                <span className="font-medium text-rose-500">
                  {runningT("stop")}
                </span>
                <span className="text-slate-400">
                  {formatNumber(stopPrice)}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-medium text-blue-500">
                  {runningT("entry")}
                </span>
                <span className="text-slate-400">
                  {formatNumber(entryPrice)}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="font-medium text-emerald-600">
                  {runningT("target")}
                </span>
                <span className="text-slate-400">
                  {formatNumber(targetPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Trade direction */}
          <div
            className={cn(
              "flex items-center justify-center rounded-md py-2",
              isBuy
                ? "bg-emerald-900/20 text-emerald-400"
                : "bg-rose-900/20 text-rose-400",
            )}
          >
            {isBuy ? (
              <ArrowUp className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDown className="mr-1 h-4 w-4" />
            )}
            <span className="font-medium">
              {runningT("direction")}:{" "}
              {isBuy ? runningT("long") : runningT("short")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFulfilledCard = () => (
    <div className="h-full">
      <div
        className={cn(
          "h-full overflow-hidden rounded-lg border shadow-md transition-all hover:shadow-lg",
          "border-gray-500",
          theme === "dark" ? "bg-slate-900" : "bg-white",
        )}
      >
        <div
          className={cn(
            "py-1.5 text-center text-sm font-semibold text-white",
            "bg-gray-500",
          )}
        >
          {fulfilledT("tradePotentialOver")}
        </div>

        <div className="flex h-full flex-col p-4">
          {/* Card header */}
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  "text-4xl font-bold",
                  theme === "dark" ? "text-white" : "text-slate-900",
                )}
              >
                {instrumentName}
              </h3>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs",
                  isBuy
                    ? "border-emerald-500/30 bg-emerald-900/10 text-emerald-400"
                    : "border-rose-500/30 bg-rose-900/10 text-rose-400",
                )}
              >
                {isBuy ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {isBuy ? fulfilledT("long") : fulfilledT("short")}
              </div>
            </div>
            <div className="mt-1 text-sm text-slate-400">
              {instrument.fullName}
            </div>
          </div>

          {/* Trade quality badge */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-900/20 px-2 py-1 text-amber-400">
              <Award className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">
                {demoT("expertTrade")}
              </span>
              <span className="ml-1 text-xs opacity-80">({riskReward}x)</span>
            </div>
          </div>

          {/* MFE - Main focus */}
          <div className="mb-6 flex flex-col items-center justify-center rounded-lg border border-blue-500/30 bg-blue-900/10 p-5">
            <div className="flex items-center gap-1 text-xl font-medium text-blue-300">
              <DollarSign className="h-5 w-5" />
              {fulfilledT("potentialProfit")}
            </div>
            <div className="mt-2 text-5xl font-bold text-blue-400">
              {formatDollar(mfeDollarValue)}
            </div>
            <div className="mt-2 text-sm text-slate-400">
              {mfeTicks} {tickLabel} {fulfilledT("maxPotential")}
            </div>
          </div>

          {/* Entry and Max Drawdown */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div
              className={cn(
                "rounded-lg p-4",
                theme === "dark" ? "bg-slate-800" : "bg-slate-100",
              )}
            >
              <div className="mb-2 text-xs text-slate-400">
                {fulfilledT("entryPrice")}
              </div>
              <div className="text-lg font-semibold">
                {formatNumber(entryPrice)}
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                {format(new Date(), "MMM d, HH:mm")}
              </div>
            </div>

            <div className="rounded-lg border border-red-500/20 bg-red-900/10 p-4">
              <div className="mb-2 flex items-center gap-1 text-xs text-red-300">
                <Target className="h-3.5 w-3.5" />
                {fulfilledT("maxDrawdown")}
              </div>
              <div className="text-lg font-bold text-red-400">
                {maeTicks} {tickLabel}
              </div>
              <div className="mt-2 text-xs text-slate-400">
                {fulfilledT("mae")}
              </div>
            </div>
          </div>

          {/* Future Trade Hint */}
          <div className="mt-auto flex items-center justify-center pt-4 text-sm text-slate-400">
            <Clock className="mr-2 h-4 w-4" />
            <span>{fulfilledT("tradingOpportunity")}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketClosedCard = () => (
    <div className="h-full">
      <div
        className={cn(
          "h-full overflow-hidden rounded-lg border shadow-md transition-all hover:shadow-lg",
          theme === "dark"
            ? "border-amber-500/30 bg-slate-900"
            : "border-amber-500/50 bg-white",
        )}
      >
        <div
          className={cn(
            "py-2 text-center font-medium text-white",
            theme === "dark"
              ? "bg-gradient-to-r from-amber-700 to-amber-500"
              : "bg-gradient-to-r from-amber-600 to-amber-400",
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
            <span>{marketT("marketClosed")}</span>
          </div>
        </div>

        <div className="p-5">
          {/* Card header */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  "text-4xl font-bold",
                  theme === "dark" ? "text-white" : "text-slate-900",
                )}
              >
                {instrumentName}
              </h3>
            </div>
            <div className="mt-1 text-sm text-slate-400">
              {instrument.fullName}
            </div>
          </div>

          {/* Status message */}
          <div
            className={cn(
              "mb-6 flex items-center rounded-md px-4 py-2.5",
              theme === "dark" ? "bg-amber-950/30" : "bg-amber-50",
            )}
          >
            <Clock className="mr-3 h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              {marketT("trading")}
            </span>
          </div>

          {/* Next opening time */}
          <div
            className={cn(
              "mb-4 rounded-lg p-4",
              theme === "dark" ? "bg-slate-800/70" : "bg-slate-100",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{marketT("nextOpen")}</span>
              </div>
              <div className="flex items-center text-xs font-medium text-emerald-500">
                <Clock className="mr-1 h-3.5 w-3.5" />
                <span>{demoT("opensIn")} 2h 15m</span>
              </div>
            </div>

            {/* UTC time */}
            <div className="mt-3 flex items-center space-x-2">
              <Globe className="h-4 w-4 text-blue-400" />
              <div>
                <div className="text-xs text-slate-500">{demoT("utcTime")}</div>
                <div className="text-lg font-bold">Monday, 9:30 AM</div>
              </div>
            </div>

            {/* Local time */}
            <div className="mt-2 flex items-center space-x-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <div>
                <div className="text-xs text-slate-500">
                  {demoT("localTime")}
                </div>
                <div className="text-lg font-bold">Monday, 5:30 AM</div>
              </div>
            </div>
          </div>

          {/* Market hours info */}
          <div
            className={cn(
              "rounded-lg p-4",
              theme === "dark" ? "bg-slate-800/70" : "bg-slate-100",
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{marketT("marketHours")}</span>
              </div>
            </div>

            <div className="mt-2">
              <div
                className={cn(
                  "rounded-md px-3 py-2",
                  theme === "dark" ? "bg-slate-700" : "bg-slate-200",
                )}
              >
                <div className="flex gap-2 text-sm">
                  <Globe className="h-4 w-4 flex-shrink-0 text-blue-400" />
                  <div className="text-sm leading-tight">
                    Mon-Fri: 9:30 AM - 4:00 PM ET
                  </div>
                </div>
              </div>

              {/* Trading days visualization */}
              <div className="mt-3 flex justify-between">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => {
                    const isActive = day !== "Sun" && day !== "Sat";
                    return (
                      <div
                        key={day}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                          isActive
                            ? theme === "dark"
                              ? "bg-blue-900/50 text-blue-300"
                              : "bg-blue-100 text-blue-800"
                            : theme === "dark"
                              ? "bg-slate-800 text-slate-500"
                              : "bg-slate-200 text-slate-500",
                        )}
                      >
                        {day.charAt(0)}
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemClosedCard = () => (
    <div className="h-full">
      <div
        className={cn(
          "h-full overflow-hidden rounded-lg border shadow-md transition-all hover:shadow-lg",
          theme === "dark"
            ? "border-blue-500/30 bg-slate-900"
            : "border-blue-500/50 bg-white",
        )}
      >
        <div
          className={cn(
            "py-2 text-center font-medium text-white",
            theme === "dark"
              ? "bg-gradient-to-r from-gray-900 to-gray-700"
              : "bg-gradient-to-r from-blue-700 to-blue-500",
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <span>{systemT("alertsOffline")}</span>
          </div>
        </div>

        <div className="p-5">
          {/* Card header */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  "text-4xl font-bold",
                  theme === "dark" ? "text-white" : "text-slate-900",
                )}
              >
                {instrumentName}
              </h3>
            </div>
            <div className="mt-1 text-sm text-slate-400">
              {instrument.fullName}
            </div>
          </div>

          {/* Status message */}
          <div
            className={cn(
              "mb-6 flex items-center rounded-md px-4 py-2.5",
              theme === "dark" ? "bg-blue-900/30" : "bg-blue-50",
            )}
          >
            <Bell className="mr-3 h-5 w-5 text-blue-500" />
            <span className="text-blue-gray text-sm font-medium dark:text-blue-400">
              {systemT("systemMessage")}
            </span>
          </div>

          {/* Next alert session */}
          <div
            className={cn(
              "mb-4 rounded-lg p-4",
              theme === "dark" ? "bg-slate-800/70" : "bg-slate-100",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{systemT("nextSession")}</span>
              </div>
              <div className="flex items-center text-xs font-medium text-blue-500">
                <Clock className="mr-1 h-3.5 w-3.5" />
                <span>{systemT("startsIn")} 3h 45m</span>
              </div>
            </div>

            <div className="mt-3 text-lg font-medium">Monday, 13:00 UTC</div>
          </div>

          {/* Alert sessions list */}
          <div
            className={cn(
              "rounded-lg p-4",
              theme === "dark" ? "bg-slate-800/70" : "bg-slate-100",
            )}
          >
            <div className="mb-2 flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{systemT("alertSessions")}</span>
            </div>

            <div className="mt-3 space-y-2">
              <div
                className={cn(
                  "rounded-md p-3",
                  theme === "dark" ? "bg-slate-700" : "bg-slate-200",
                )}
              >
                <div className="flex justify-between">
                  <div className="text-sm font-medium">
                    {systemT("session")} 1
                  </div>
                  <div className="text-xs text-slate-500">
                    Mon, Tue, Wed, Thu, Fri
                  </div>
                </div>
                <div className="mt-1 text-lg font-medium">
                  13:00 - 20:00 UTC
                </div>
              </div>
              <div
                className={cn(
                  "rounded-md p-3",
                  theme === "dark" ? "bg-slate-700" : "bg-slate-200",
                )}
              >
                <div className="flex justify-between">
                  <div className="text-sm font-medium">
                    {systemT("session")} 2
                  </div>
                  <div className="text-xs text-slate-500">
                    Mon, Tue, Wed, Thu
                  </div>
                </div>
                <div className="mt-1 text-lg font-medium">
                  22:00 - 04:00 UTC
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Return the appropriate card type
  switch (type) {
    case "running":
      return renderRunningCard();
    case "fulfilled":
      return renderFulfilledCard();
    case "marketClosed":
      return renderMarketClosedCard();
    case "systemClosed":
      return renderSystemClosedCard();
    default:
      return renderRunningCard();
  }
}
