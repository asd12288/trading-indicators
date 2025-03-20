"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Info, Minus } from "lucide-react";
import SignalToolTooltip from "./SignalCard/SignalToolTooltip";
import useForexPrice from "@/hooks/useForexPrice";

interface LastPriceDisplayProps {
  instrumentName: string;
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
  className?: string;
}

const LastPriceDisplay = ({
  instrumentName,
  size = "medium",
  showLabel = true,
  className = "",
}: LastPriceDisplayProps) => {
  const {
    lastPrice,
    isLoading,
    error,
    lastUpdated,
    refreshNow,
    source,
    priceDirection,
  } = useForexPrice(instrumentName);
  const t = useTranslations("InstrumentStatusCard");
  const [isFlashing, setIsFlashing] = useState(false);

  const prevPriceRef = useRef<number | null>(null);

  // Debug counter to show component is alive
  const renderCountRef = useRef(0);
  renderCountRef.current++;

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
  }, [lastPrice?.last]); // Only depend on lastPrice.last, not the entire lastPrice object

  // Periodic refresh as an extra safety measure
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      refreshNow();
    }, 60000); // Refresh every 60 seconds (adjusted to comply with API rate limits)

    return () => clearInterval(refreshTimer);
  }, [refreshNow]);

  // Format number to always show 2 decimal places
  const formatPrice = (price: number): string => {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
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
