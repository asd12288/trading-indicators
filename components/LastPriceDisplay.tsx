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
  hideChartDetails?: boolean; // New prop to hide chart details
  isDemo?: boolean; // New prop to indicate demo mode
}

// Generate fake price data for demo mode
const generateFakePriceData = (pointCount: number = 20, trend: 'up' | 'down' | 'neutral' = 'neutral'): number[] => {
  // Start with a base price between 1 and 100
  const basePrice = Math.random() * 99 + 1;
  const volatility = basePrice * 0.02; // 2% volatility
  
  // Create price array with random movements but following the general trend
  return Array.from({ length: pointCount }, (_, i) => {
    // Random component
    const randomComponent = (Math.random() - 0.5) * volatility;
    
    // Trend component
    let trendComponent = 0;
    if (trend === 'up') {
      trendComponent = (i / pointCount) * (volatility * 2);
    } else if (trend === 'down') {
      trendComponent = -(i / pointCount) * (volatility * 2);
    }
    
    return basePrice + randomComponent + trendComponent;
  });
};

// Improved sparkline generator for actual price data
const generateSparkline = (
  prices: number[],
  width = 100,
  height = 20,
  color: string,
  hideDetails = false, // New parameter
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
      {/* Only show middle reference line if not hiding details */}
      {!hideDetails && (
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="#44445530"
          strokeWidth="0.5"
          strokeDasharray="2,2"
        />
      )}

      {/* Path for the price line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Only show the last point if not hiding details */}
      {!hideDetails && (
        <circle
          cx={width}
          cy={
            height - ((prices[prices.length - 1] - min) / totalRange) * height
          }
          r="2.5"
          fill={color}
        />
      )}

      {/* Only show small dots for price points if not hiding details */}
      {!hideDetails &&
        prices.map((price, index) => {
          if (index === prices.length - 1 || index % 3 !== 0) return null;
          const x = (index / (prices.length - 1)) * width;
          const y = height - ((price - min) / totalRange) * height;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1"
              fill={color}
              opacity="0.5"
            />
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
  hideChartDetails = false,
  isDemo = false, // Add the isDemo prop with default false
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
  
  // Generate fake data for demo mode
  const [fakePriceData] = useState(() => {
    // Randomly choose a trend for the demo data
    const trends: Array<'up' | 'down' | 'neutral'> = ['up', 'down', 'neutral'];
    const randomTrend = trends[Math.floor(Math.random() * trends.length)];
    return generateFakePriceData(20, randomTrend);
  });
  
  // Use fake data for demo mode or real data otherwise
  const displayPriceHistory = isDemo ? fakePriceData : priceHistory;
  const displayPriceDirection = isDemo 
    ? (fakePriceData[fakePriceData.length - 1] > fakePriceData[0] ? 'up' : 
       fakePriceData[fakePriceData.length - 1] < fakePriceData[0] ? 'down' : 'neutral') 
    : priceDirection;
  const displayLastPrice = isDemo 
    ? fakePriceData[fakePriceData.length - 1] 
    : lastPrice?.last;

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
    if (!priceStr.includes(".") || priceStr.split(".")[1].length < 2) {
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
    if (!displayPriceHistory || displayPriceHistory.length < 2) return null;
    const first = displayPriceHistory[0];
    const last = displayPriceHistory[displayPriceHistory.length - 1];
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
  }[displayPriceDirection || "neutral"];

  // Sparkline color based on price direction with better opacity
  const sparklineColor =
    displayPriceDirection === "up"
      ? "#10b981"
      : displayPriceDirection === "down"
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

  // If in demo mode, always show the demo chart even if there's an error
  // Otherwise, show the error message
  if (error && !isDemo) {
    return <div className="text-amber-500">Error loading price</div>;
  }

  const percentChange = calculateChange();
  const isPositiveChange = percentChange && parseFloat(percentChange) >= 0;

  // Clean version for market pulse display
  if (
    showSparkline &&
    hideChartDetails &&
    displayPriceHistory &&
    displayPriceHistory.length > 1
  ) {
    return (
      <div className={className}>
        {generateSparkline(
          displayPriceHistory,
          size === "small" ? 90 : size === "medium" ? 120 : 150,
          30, // Increased height for better visibility
          sparklineColor,
          true, // Pass hideDetails as true
        )}
      </div>
    );
  }

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
          {displayLastPrice !== undefined
            ? formatPrice(displayLastPrice)
            : t("n/a")}
        </motion.div>

        {/* Price direction indicator */}
        {displayPriceDirection !== "neutral" && (
          <motion.div
            initial={{ opacity: 0, y: displayPriceDirection === "up" ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center"
          >
            {displayPriceDirection === "up" ? (
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
      {showSparkline &&
        displayPriceHistory &&
        displayPriceHistory.length > 1 &&
        !hideChartDetails && (
          <div className="mt-2 rounded-md bg-slate-800/10 p-2 dark:bg-slate-700/20">
            <div className="h-[24px] w-full">
              {generateSparkline(
                displayPriceHistory,
                size === "large" ? 150 : size === "medium" ? 100 : 70,
                24,
                sparklineColor,
                false, // Not hiding details in the standard view
              )}
            </div>

            <div className="mt-1 flex items-center justify-between text-[10px]">
              <div className="text-slate-500">
                {displayPriceHistory.length > 1 ? `${displayPriceHistory.length} points` : ""}
              </div>

              {percentChange && (
                <div
                  className={
                    isPositiveChange ? "text-green-400" : "text-red-400"
                  }
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
