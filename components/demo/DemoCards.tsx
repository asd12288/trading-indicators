"use client";

import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  Award,
  Bell,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  Target,
} from "lucide-react";
import { useTranslations } from "next-intl";
import KeyPricesGrid from "../SignalCard/components/KeyPricesGrid";
import PriceInfoSection from "../SignalCard/components/PriceInfoSection";
import PriceScaleVisualization from "../SignalCard/components/PriceScaleVisualization";
import TradingViewWidget from "../TradingViewWidget";

type DemoCardType = "running" | "fulfilled" | "marketClosed" | "systemClosed";

interface DemoCardProps {
  type: DemoCardType;
  instrumentName?: string;
  tradeSide?: "Long" | "Short";
}

// Market data with realistic pricing based on actual market values as of May 2024
const instrumentData = {
  EURUSD: {
    fullName: "Euro/US Dollar",
    basePrice: 1.07732, // Example current market price
    tickSize: 0.00001, // 0.1 pip per tick
    tickValue: 10.0, // $1 per pip per 0.1 lot (10k units)
    profitTarget: 50, // 50 pips is a realistic target for intraday or swing
    stopLoss: 25, // 25 pips common for tight risk management
    volatilityRange: 2, // Moderate intraday range factor (0.5 - 0.7 realistic)
    format: "forex",
    averageDailyRange: 75, // EUR/USD ranges from 60 to 100 pips daily on average
    typicalMFE: 24, // Maximum Favorable Excursion - 80 pips before reversal
    typicalMAE: 5, // Maximum Adverse Excursion - 15-25 pips realistic
    priceHistory: [1.07732], // Starting price history
    decimalPlaces: 5, // Forex quotes are usually in 5 decimals (1.07732)
  },
};

export default function DemoCard({
  type,
  instrumentName = "EURUSD", // Default to ES instead of NQ
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
  const lastUpdateTime = new Date(); // Static time for demo

  // Get instrument-specific data
  const instrument = instrumentData.EURUSD;

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

  // Use a static price for the demo instead of simulating movement
  // Position it about 35% of the way to target for a realistic in-progress trade
  const currentPrice = isBuy
    ? entryPrice + targetTicks * instrument.tickSize * 0.35
    : entryPrice - targetTicks * instrument.tickSize * 0.35;

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

  // For forex, use "pips" instead of "ticks"
  const tickLabel = instrument.format === "forex" ? "pips" : "ticks";

  // Demo cards components
  const renderRunningCard = () => (
    <div className="h-full">
      <div
        className={cn(
          "h-full overflow-hidden rounded-lg border shadow-md transition-all hover:shadow-lg",
          isBuy ? "border-emerald-500" : "border-rose-500",
          theme === "dark"
            ? "bg-slate-900"
            : "border border-slate-200 bg-white",
        )}
      >
        <div
          className={cn(
            "relative py-1.5 text-center text-sm font-semibold text-white",
            isBuy ? "bg-emerald-600" : "bg-rose-600",
          )}
        >
          {runningT("liveTracking")}

          {/* Demo badge */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-black/20 px-1.5 py-0.5 text-xs font-medium">
            DEMO
          </div>
        </div>

        <div className="p-4">
          {/* Header with full name - Matches RunningSignalCard */}
          <div className="mb-4 flex justify-between">
            <div className="flex flex-col gap-2">
              <h3
                className={cn(
                  "text-4xl font-bold",
                  theme === "dark" ? "text-white" : "text-slate-900",
                )}
              >
                {instrumentName}
              </h3>
              <div className="mt-1 text-sm text-slate-400">
                {instrument.fullName}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div
                className={cn(
                  "flex items-center gap-1 rounded-md border px-2 py-1",
                  "font-semibold text-white",
                  isBuy
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700",
                )}
              >
                {isBuy ? (
                  <ArrowUp className="h-5 w-5" />
                ) : (
                  <ArrowDown className="h-5 w-5" />
                )}
                <span className="text-xl">{isBuy ? "BUY" : "SELL"}</span>
              </div>

              {/* Time info */}
              <div className="mb-4 flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {runningT("started")} 45 {runningT("tradeDuration")}
                </span>
              </div>
            </div>
          </div>

          {/* Current Price Info Section - Similar to PriceInfoSection */}
          <PriceInfoSection
            instrumentName={instrumentName}
            isLoading={false}
            currentPrice={currentPrice}
            entryPrice={entryPrice}
            currentPnL={dollarValue}
            isProfitable={isProfitable}
            pnlPercentage={parseFloat(performancePercentage)}
            isForex={instrument.format === "forex"}
            isDemo={true} // Always use demo mode for demo cards
          />

          {/* Key prices in a grid - Similar to KeyPricesGrid */}
          <KeyPricesGrid
            entryPrice={entryPrice}
            takeProfitPrice={targetPrice}
            stopLossPrice={stopPrice}
            profitTargetPercent={
              (Math.abs(targetPrice - entryPrice) / entryPrice) * 100
            }
            stopLossPercent={
              (Math.abs(stopPrice - entryPrice) / entryPrice) * 100
            }
          />

          {/* Price scale visualization - Matching PriceScaleVisualization */}
          <PriceScaleVisualization
            entryPrice={entryPrice}
            takeProfitPrice={targetPrice}
            stopLossPrice={stopPrice}
            currentPosition={currentPosition}
            entryPosition={entryPosition}
            isProfitable={isProfitable}
            isBuy={isBuy}
          />

          {/* Add TradingViewWidget in demo mode */}
          <div className="mb-4">
            <TradingViewWidget
              symbol={instrumentName}
              height={180}
              showToolbar={false}
              lightweight={true}
              interval="15"
              isBuy={isBuy}
            />
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
            "relative py-1.5 text-center text-sm font-semibold text-white",
            "bg-gray-500",
          )}
        >
          {fulfilledT("tradePotentialOver")}

          {/* Demo badge */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-black/20 px-1.5 py-0.5 text-xs font-medium">
            DEMO
          </div>
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
            "relative py-2 text-center font-medium text-white",
            theme === "dark"
              ? "bg-gradient-to-r from-amber-700 to-amber-500"
              : "bg-gradient-to-r from-amber-600 to-amber-400",
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
            <span>{marketT("marketClosed")}</span>
          </div>

          {/* Demo badge */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-black/20 px-1.5 py-0.5 text-xs font-medium">
            DEMO
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
            "relative py-2 text-center font-medium text-white",
            theme === "dark"
              ? "bg-gradient-to-r from-gray-900 to-gray-700"
              : "bg-gradient-to-r from-blue-700 to-blue-500",
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <span>{systemT("alertsOffline")}</span>
          </div>

          {/* Demo badge */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-black/20 px-1.5 py-0.5 text-xs font-medium">
            DEMO
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
