"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import useLast from "@/hooks/useLast";
import SignalToolTooltip from "./SignalCard/SignalToolTooltip";

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
  const { lastPrice, isLoading, error, lastUpdated, refreshNow } =
    useLast(instrumentName);
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
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(refreshTimer);
  }, [refreshNow]);

  // Format number to always show 2 decimal places
  const formatPrice = (price: number): string => {
    return price.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  // Size-based classes
  const fontSizeClass = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-3xl md:text-4xl",
  }[size];

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div
          className={`h-8 w-24 rounded bg-slate-700 ${showLabel ? "mt-6" : ""}`}
        ></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-amber-500">Error loading price</div>;
  }

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-end gap-1">
          <SignalToolTooltip text={t("lastPriceTooltip")}>
            <div className="flex cursor-help items-center text-sm font-medium text-slate-400">
              {t("lastPrice")}
              <Info size={12} className="ml-1 opacity-70" />
            </div>
          </SignalToolTooltip>
        </div>
      )}

      <motion.div
        className={`font-bold ${fontSizeClass} text-primary`}
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

      {/* Optional debug info - remove in production */}
      {process.env.NODE_ENV !== "production" && (
        <div className="mt-1 text-xs text-slate-500 opacity-50">
          {lastUpdated?.toLocaleTimeString()}
        </div>
      )}

      {size === "large" && lastUpdated && (
        <div className="mt-1 text-xs text-slate-500">
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default LastPriceDisplay;
