"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";
import { ArrowUp, ArrowDown, Clock, Zap, Target, DollarSign, Award, Bell, Globe, Calendar } from "lucide-react";

type DemoCardType = "running" | "fulfilled" | "marketClosed" | "systemClosed";

interface DemoCardProps {
  type: DemoCardType;
  instrumentName?: string;
  tradeSide?: "Long" | "Short";
}

// Realistic instrument price data
const instrumentData = {
  ES: {
    fullName: "E-mini S&P 500 Future",
    basePrice: 5240.50,
    tickSize: 0.25,
    tickValue: 12.50,
    profitTarget: 20, // ticks
    stopLoss: 8, // ticks
    volatilityRange: 0.5, // percentage
  },
  NQ: {
    fullName: "E-mini Nasdaq-100 Future",
    basePrice: 18520.75,
    tickSize: 0.25,
    tickValue: 5.00,
    profitTarget: 30, // ticks
    stopLoss: 15, // ticks
    volatilityRange: 0.7, // percentage
  }
};

export default function DemoCard({ type, instrumentName = "ES", tradeSide = "Long" }: DemoCardProps) {
  const { theme } = useTheme();
  const isBuy = tradeSide === "Long";
  
  // Get instrument-specific data
  const instrument = instrumentName in instrumentData ? instrumentData[instrumentName] : instrumentData.ES;
  
  // Initialize prices based on instrument data
  const entryPrice = instrument.basePrice;
  const targetTicks = instrument.profitTarget;
  const stopTicks = instrument.stopLoss;
  
  // Calculate target and stop prices based on direction
  const targetPrice = isBuy 
    ? entryPrice + (targetTicks * instrument.tickSize) 
    : entryPrice - (targetTicks * instrument.tickSize);
  
  const stopPrice = isBuy 
    ? entryPrice - (stopTicks * instrument.tickSize) 
    : entryPrice + (stopTicks * instrument.tickSize);
  
  // For running cards, simulate price movement
  const [currentPrice, setCurrentPrice] = useState(
    isBuy 
      ? entryPrice + (targetTicks * instrument.tickSize * 0.3) // Start 30% toward target for long
      : entryPrice - (targetTicks * instrument.tickSize * 0.3) // Start 30% toward target for short
  );
  
  // Simulate price movement for running cards
  useEffect(() => {
    if (type !== "running") return;
    
    // Create a realistic price movement simulation
    const interval = setInterval(() => {
      setCurrentPrice(prevPrice => {
        // Random price movement within volatility range
        const volatilityFactor = instrument.volatilityRange * instrument.tickSize;
        const movement = (Math.random() - 0.3) * volatilityFactor; // Slightly biased toward positive for demo
        
        let newPrice = prevPrice + movement;
        
        // Ensure price stays within logical bounds (don't go beyond target or below stop for demo purposes)
        if (isBuy) {
          if (newPrice > targetPrice * 0.95) newPrice = targetPrice * 0.9; // Don't quite reach target
          if (newPrice < stopPrice * 1.2) newPrice = stopPrice * 1.3; // Don't get too close to stop
        } else {
          if (newPrice < targetPrice * 1.05) newPrice = targetPrice * 1.1; // Don't quite reach target
          if (newPrice > stopPrice * 0.8) newPrice = stopPrice * 0.7; // Don't get too close to stop
        }
        
        return parseFloat(newPrice.toFixed(2));
      });
    }, 1500); // Update every 1.5 seconds
    
    return () => clearInterval(interval);
  }, [type, isBuy, targetPrice, stopPrice, instrument.tickSize, instrument.volatilityRange]);

  // Format numbers consistently
  const formatNumber = (num: number) => {
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
    const range = targetPrice - stopPrice;
    if (range === 0) return 50;
    return ((price - stopPrice) / range) * 100;
  };

  const entryPosition = calculatePosition(entryPrice);
  const currentPosition = calculatePosition(currentPrice);
  
  // Calculate performance metrics for display
  const priceDifference = Math.abs(currentPrice - entryPrice);
  const performancePercentage = ((priceDifference / entryPrice) * 100).toFixed(2);
  const ticksDifference = Math.round(priceDifference / instrument.tickSize);
  const dollarValue = ticksDifference * instrument.tickValue;
  const isProfitable = isBuy ? (currentPrice > entryPrice) : (currentPrice < entryPrice);

  // For fulfilled cards, generate realistic MFE (Maximum Favorable Excursion)
  const mfeTicks = Math.round(instrument.profitTarget * 0.85); // 85% of potential
  const mfeDollarValue = Math.round(mfeTicks * instrument.tickValue);
  const maeTicks = Math.round(instrument.stopLoss * 0.4); // 40% of potential risk
  
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
            isBuy ? "bg-emerald-600" : "bg-rose-600"
          )}
        >
          LIVE
        </div>

        <div className="p-4">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className={cn("text-4xl font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>
                {instrumentName}
              </h3>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-md border px-2 py-1 text-xs",
                  isBuy 
                    ? "border-emerald-500/30 bg-emerald-900/10 text-emerald-400" 
                    : "border-rose-500/30 bg-rose-900/10 text-rose-400"
                )}
              >
                {isBuy ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {tradeSide}
              </div>
            </div>
            <div className="mt-1 text-sm text-slate-400">
              {instrument.fullName}
            </div>
          </div>

          {/* Time info */}
          <div className="mb-4 flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            <span>Started 45 minutes ago</span>
          </div>

          {/* Current Price - with animation */}
          <div
            className={cn(
              "mb-4 rounded-lg border-2 p-4",
              theme === "dark" ? "bg-slate-800" : "bg-slate-50",
              isProfitable ? "border-emerald-500/50" : "border-rose-500/50"
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">Current Price</span>
                <span className="ml-1.5 rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  LIVE
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="mb-0.5 text-xs text-slate-400">Live Performance</div>
                <div
                  className={cn(
                    "text-sm font-medium",
                    isProfitable ? "text-emerald-400" : "text-rose-400"
                  )}
                >
                  {isProfitable ? "+" : "-"}
                  {formatNumber(priceDifference)}
                </div>
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold tracking-tight animate-pulse">
                {formatNumber(currentPrice)}
              </div>
              <div className={cn(
                "text-lg font-medium",
                isProfitable ? "text-emerald-400" : "text-rose-400"
              )}>
                {isProfitable ? "+" : "-"}{performancePercentage}%
              </div>
            </div>

            {/* Ticks and dollar value */}
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {ticksDifference} ticks ({formatDollar(dollarValue)})
              </span>
            </div>
          </div>

          {/* Key prices in a grid */}
          <div className="mb-5 grid grid-cols-3 gap-2">
            {/* Entry Price */}
            <div className={cn("rounded-md p-2", theme === "dark" ? "bg-slate-800" : "bg-slate-100")}>
              <div className="text-xs text-slate-400">Entry</div>
              <div className="font-medium">{formatNumber(entryPrice)}</div>
            </div>

            {/* Target Price */}
            <div
              className={cn(
                "rounded-md p-2",
                theme === "dark" ? "bg-emerald-900/20" : "bg-emerald-50",
                theme === "dark" ? "text-emerald-400" : "text-emerald-600"
              )}
            >
              <div className="text-xs opacity-80">Target</div>
              <div className="font-medium">{formatNumber(targetPrice)}</div>
              <div className="mt-0.5 text-xs opacity-80">
                {isBuy ? "+" : "-"}{targetTicks} ticks
              </div>
            </div>

            {/* Stop Loss */}
            <div
              className={cn(
                "rounded-md p-2",
                theme === "dark" ? "bg-rose-900/20" : "bg-rose-50",
                theme === "dark" ? "text-rose-400" : "text-rose-600"
              )}
            >
              <div className="text-xs opacity-80">Stop</div>
              <div className="font-medium">{formatNumber(stopPrice)}</div>
              <div className="mt-0.5 text-xs opacity-80">
                {isBuy ? "-" : "+"}{stopTicks} ticks
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
                <span className="font-medium text-rose-500">Stop</span>
                <span className="text-slate-400">{formatNumber(stopPrice)}</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="font-medium text-blue-500">Entry</span>
                <span className="text-slate-400">{formatNumber(entryPrice)}</span>
              </div>

              <div className="flex flex-col items-end">
                <span className="font-medium text-emerald-600">Target</span>
                <span className="text-slate-400">{formatNumber(targetPrice)}</span>
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
              {isBuy ? "LONG" : "SHORT"}
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
        <div className={cn("py-1.5 text-center text-sm font-semibold text-white", "bg-gray-500")}>
          Trade Potential Over
        </div>

        <div className="flex h-full flex-col p-4">
          {/* Card header */}
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <h3 className={cn("text-4xl font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>
                {instrumentName}
              </h3>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs",
                  isBuy
                    ? "border-emerald-500/30 bg-emerald-900/10 text-emerald-400"
                    : "border-rose-500/30 bg-rose-900/10 text-rose-400"
                )}
              >
                {isBuy ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {tradeSide}
              </div>
            </div>
            <div className="mt-1 text-sm text-slate-400">
              {instrument.fullName}
            </div>
          </div>

          {/* Trade quality badge */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-md border px-2 py-1 border-amber-500/40 bg-amber-900/20 text-amber-400">
              <Award className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Expert Trade</span>
              <span className="ml-1 text-xs opacity-80">(4.5x)</span>
            </div>
          </div>

          {/* MFE - Main focus */}
          <div className="mb-6 flex flex-col items-center justify-center rounded-lg border p-5 border-blue-500/30 bg-blue-900/10">
            <div className="flex items-center gap-1 text-xl font-medium text-blue-300">
              <DollarSign className="h-5 w-5" />
              Potential Profit
            </div>
            <div className="mt-2 text-5xl font-bold text-blue-400">
              {formatDollar(mfeDollarValue)}
            </div>
            <div className="mt-2 text-sm text-slate-400">
              {mfeTicks} ticks maximum potential
            </div>
          </div>

          {/* Entry and Max Drawdown */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className={cn("rounded-lg p-4", theme === "dark" ? "bg-slate-800" : "bg-slate-100")}>
              <div className="mb-2 text-xs text-slate-400">
                Entry Price
              </div>
              <div className="text-lg font-semibold">{formatNumber(entryPrice)}</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                {format(new Date(), "MMM d, HH:mm")}
              </div>
            </div>

            <div className="rounded-lg border p-4 border-red-500/20 bg-red-900/10">
              <div className="mb-2 flex items-center gap-1 text-xs text-red-300">
                <Target className="h-3.5 w-3.5" />
                Max Risk (Drawdown)
              </div>
              <div className="text-lg font-bold text-red-400">
                {maeTicks} ticks
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Maximum adverse movement
              </div>
            </div>
          </div>

          {/* Future Trade Hint */}
          <div className="mt-auto flex items-center justify-center pt-4 text-sm text-slate-400">
            <Clock className="mr-2 h-4 w-4" />
            <span>More opportunities coming soon</span>
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
          theme === "dark" ? "border-amber-500/30 bg-slate-900" : "border-amber-500/50 bg-white",
        )}
      >
        <div
          className={cn(
            "py-2 text-center font-medium text-white",
            theme === "dark" ? "bg-gradient-to-r from-amber-700 to-amber-500" : "bg-gradient-to-r from-amber-600 to-amber-400",
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
            <span>Market Closed</span>
          </div>
        </div>

        <div className="p-5">
          {/* Card header */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <h3 className={cn("text-4xl font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>
                {instrumentName}
              </h3>
            </div>
            <div className="mt-1 text-sm text-slate-400">
              E-mini S&P 500 Future
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
              Trading is currently unavailable
            </span>
          </div>

          {/* Next opening time */}
          <div className={cn("mb-4 rounded-lg p-4", theme === "dark" ? "bg-slate-800/70" : "bg-slate-100")}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Next opens at</span>
              </div>
              <div className="flex items-center text-xs font-medium text-emerald-500">
                <Clock className="mr-1 h-3.5 w-3.5" />
                <span>Opens in 2h 15m</span>
              </div>
            </div>

            {/* UTC time */}
            <div className="mt-3 flex items-center space-x-2">
              <Globe className="h-4 w-4 text-blue-400" />
              <div>
                <div className="text-xs text-slate-500">UTC</div>
                <div className="text-lg font-bold">
                  Monday, 9:30 AM
                </div>
              </div>
            </div>

            {/* Local time */}
            <div className="mt-2 flex items-center space-x-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <div>
                <div className="text-xs text-slate-500">Local Time</div>
                <div className="text-lg font-bold">
                  Monday, 5:30 AM
                </div>
              </div>
            </div>
          </div>

          {/* Market hours info */}
          <div className={cn("rounded-lg p-4", theme === "dark" ? "bg-slate-800/70" : "bg-slate-100")}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Trading hours</span>
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
                  <div className="text-sm leading-tight">Mon-Fri: 9:30 AM - 4:00 PM ET</div>
                </div>
              </div>

              {/* Trading days visualization */}
              <div className="mt-3 flex justify-between">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
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
                })}
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
          theme === "dark" ? "border-blue-500/30 bg-slate-900" : "border-blue-500/50 bg-white",
        )}
      >
        <div
          className={cn(
            "py-2 text-center font-medium text-white",
            theme === "dark" ? "bg-gradient-to-r from-gray-900 to-gray-700" : "bg-gradient-to-r from-blue-700 to-blue-500",
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <span>Alerts Currently Offline</span>
          </div>
        </div>

        <div className="p-5">
          {/* Card header */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <h3 className={cn("text-4xl font-bold", theme === "dark" ? "text-white" : "text-slate-900")}>
                {instrumentName}
              </h3>
            </div>
            <div className="mt-1 text-sm text-slate-400">
              E-mini S&P 500 Future
            </div>
          </div>

          {/* Status message */}
          <div className={cn(
            "mb-6 flex items-center rounded-md px-4 py-2.5",
            theme === "dark" ? "bg-blue-900/30" : "bg-blue-50",
          )}>
            <Bell className="mr-3 h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-gray dark:text-blue-400">
              Alert system is currently not active for this instrument
            </span>
          </div>

          {/* Next alert session */}
          <div className={cn(
            "mb-4 rounded-lg p-4",
            theme === "dark" ? "bg-slate-800/70" : "bg-slate-100",
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Next Alert Session</span>
              </div>
              <div className="flex items-center text-xs font-medium text-blue-500">
                <Clock className="mr-1 h-3.5 w-3.5" />
                <span>Starts in 3h 45m</span>
              </div>
            </div>

            <div className="mt-3 text-lg font-medium">
              Monday, 13:00 UTC
            </div>
          </div>

          {/* Alert sessions list */}
          <div className={cn(
            "rounded-lg p-4",
            theme === "dark" ? "bg-slate-800/70" : "bg-slate-100",
          )}>
            <div className="mb-2 flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Scheduled Alert Sessions</span>
            </div>

            <div className="mt-3 space-y-2">
              <div className={cn("rounded-md p-3", theme === "dark" ? "bg-slate-700" : "bg-slate-200")}>
                <div className="flex justify-between">
                  <div className="text-sm font-medium">Session 1</div>
                  <div className="text-xs text-slate-500">Mon, Tue, Wed, Thu, Fri</div>
                </div>
                <div className="mt-1 text-lg font-medium">13:00 - 20:00 UTC</div>
              </div>
              <div className={cn("rounded-md p-3", theme === "dark" ? "bg-slate-700" : "bg-slate-200")}>
                <div className="flex justify-between">
                  <div className="text-sm font-medium">Session 2</div>
                  <div className="text-xs text-slate-500">Mon, Tue, Wed, Thu</div>
                </div>
                <div className="mt-1 text-lg font-medium">22:00 - 04:00 UTC</div>
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
