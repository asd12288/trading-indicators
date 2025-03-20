"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Info } from "lucide-react";
import SignalToolTooltip from "./SignalCard/SignalToolTooltip";
import useForexPrice from "@/hooks/useForexPrice";

interface LastPriceDisplayProps {
  instrumentName: string;
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
  className?: string;
  showSparkline?: boolean;
}

// Improved sparkline generator for actual price data
const generateSparkline = (
  prices: number[],
  width = 100,
  height = 20,
  color: string,
) => {
  if (!prices || prices.length < 2) return null;

  // Find min and max with padding to avoid flat lines
  const minValue = Math.min(...prices);
  const maxValue = Math.max(...prices);

  // If min and max are very close, add some padding to make the line visible
  const range = maxValue - minValue;
  const paddingFactor = range < 0.0001 ? 0.0005 : range * 0.1;

  const min = minValue - paddingFactor;
  const max = maxValue + paddingFactor;
  const totalRange = max - min;

  // Calculate points for the path
  const points = prices
    .map((price, index) => {
      const x = (index / (prices.length - 1)) * width;
      // Invert Y axis since SVG coordinates start from top
      const y = height - ((price - min) / totalRange) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {/* Middle reference line */}
      <line
        x1="0"
        y1={height / 2}
        x2={width}
        y2={height / 2}
        stroke="#44445530"
        strokeWidth="0.5"
        strokeDasharray="2,2"
      />

      {/* Path for the price line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dot for the last price point */}
      <circle
        cx={width}
        cy={height - ((prices[prices.length - 1] - min) / totalRange) * height}
        r="2.5"
        fill={color}
      />

      {/* Show small dots for each price point for better visualization */}
      {prices.map((price, index) => {
        if (index === prices.length - 1 || index % 3 !== 0) return null; // Only show some dots to avoid clutter
        const x = (index / (prices.length - 1)) * width;
        const y = height - ((price - min) / totalRange) * height;
        return (
          <circle key={index} cx={x} cy={y} r="1" fill={color} opacity="0.5" />
        );
      })}
    </svg>
  );
};

const LastPriceDisplay = ({
  instrumentName,
  size = "medium",
  showLabel = true,
  className = "",
  showSparkline = false,
}: LastPriceDisplayProps) => {
  const {
    lastPrice,
    isLoading,
    error,
    lastUpdated,
    refreshNow,
    source,
    priceDirection,
    priceHistory,
  } = useForexPrice(instrumentName);
  const t = useTranslations("InstrumentStatusCard");
  const [isFlashing, setIsFlashing] = useState(false);

  const prevPriceRef = useRef<number | null>(null);

  // Handle animation when price changes
  useEffect(() => {
    if (
      lastPrice?.last !== undefined &&
      lastPrice.last !== prevPriceRef.current
    ) {
      console.log(
        `⚡ Price update: ${prevPriceRef.current} → ${lastPrice.last}`,
      );

      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 1000);
      prevPriceRef.current = lastPrice.last;
      return () => clearTimeout(timer);
    }
  }, [lastPrice?.last]);

  // Periodic refresh as an extra safety measure
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      refreshNow();
    }, 60000);

    return () => clearInterval(refreshTimer);
  }, [refreshNow]);

  // Format number to show all significant decimal places
  const formatPrice = (price: number): string => {
    // For forex and crypto, we want to show all decimal places
    // Convert to string to preserve all decimal places
    const priceStr = price.toString();
    
    // If it's a whole number or has fewer than 2 decimals, ensure we show at least 2
    if (!priceStr.includes('.') || priceStr.split('.')[1].length < 2) {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 10,
      });
    }
    
    // Otherwise, show all existing decimal places
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 10, // Allow up to 10 decimal places
    });
  };

  // Calculate percentage change for the price history
  const calculateChange = () => {
    if (!priceHistory || priceHistory.length < 2) return null;
    const first = priceHistory[0];
    const last = priceHistory[priceHistory.length - 1];
    const change = ((last - first) / first) * 100;
    return change.toFixed(2);
  };

  // Size-based classes
  const fontSizeClass = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-3xl md:text-4xl",
  }[size];

  // Direction-based colors
  const directionColor = {
    up: "text-green-400",
    down: "text-red-400",
    neutral: "text-primary",
  }[priceDirection || "neutral"];

  // Sparkline color based on price direction with better opacity
  const sparklineColor =
    priceDirection === "up"
      ? "#10b981"
      : priceDirection === "down"
        ? "#ef4444"
        : "#60a5fa";

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        {showLabel && (
          <div className="mb-1 h-4 w-24 self-end rounded bg-slate-700"></div>
        )}
        <div className="h-8 w-32 rounded-md bg-slate-700"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-amber-500">Error loading price</div>;
  }

  const percentChange = calculateChange();
  const isPositiveChange = percentChange && parseFloat(percentChange) >= 0;

  return (
    <div className={`flex flex-col ${className}`}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-end gap-1">
          <SignalToolTooltip text={t("lastPriceTooltip")}>
            <div className="flex cursor-help items-center gap-1 text-sm font-medium text-slate-400">
              {t("lastPrice")}
              <Info size={12} className="opacity-70" />
            </div>
          </SignalToolTooltip>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <motion.div
          className={`font-bold ${fontSizeClass} ${directionColor}`}
          animate={{
            opacity: isFlashing ? [1, 0.5, 1] : 1,
            scale: isFlashing ? [1, 1.03, 1] : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          {lastPrice?.last !== undefined
            ? formatPrice(lastPrice.last)
            : t("n/a")}
        </motion.div>

        {/* Price direction indicator */}
        {priceDirection !== "neutral" && (
          <motion.div
            initial={{ opacity: 0, y: priceDirection === "up" ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center"
          >
            {priceDirection === "up" ? (
              <ArrowUp
                size={size === "large" ? 20 : 16}
                className="text-green-400"
              />
            ) : (
              <ArrowDown
                size={size === "large" ? 20 : 16}
                className="text-red-400"
              />
            )}
          </motion.div>
        )}
      </div>

      {/* Enhanced Sparkline display */}
      {showSparkline && priceHistory && priceHistory.length > 1 && (
        <div className="mt-2 rounded-md bg-slate-800/10 p-2 dark:bg-slate-700/20">
          <div className="h-[24px] w-full">
            {generateSparkline(
              priceHistory,
              size === "large" ? 150 : size === "medium" ? 100 : 70,
              24,
              sparklineColor,
            )}
          </div>

          <div className="mt-1 flex items-center justify-between text-[10px]">
            <div className="text-slate-500">
              {priceHistory.length > 1 ? `${priceHistory.length} points` : ""}
            </div>

            {percentChange && (
              <div
                className={isPositiveChange ? "text-green-400" : "text-red-400"}
              >
                {isPositiveChange ? "+" : ""}
                {percentChange}%
              </div>
            )}
          </div>
        </div>
      )}

      {size === "large" && lastUpdated && (
        <div className="mt-2 text-xs text-slate-500">
          Updated: {lastUpdated.toLocaleTimeString()}
          {process.env.NODE_ENV === "development" && (
            <span className="ml-2 text-xs opacity-50">
              ({source || "unknown"})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default LastPriceDisplay;
