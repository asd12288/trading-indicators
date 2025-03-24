"use client";

import { useTheme } from "@/context/theme-context";
import { useEffect, useRef } from "react";

interface TradingViewWidgetProps {
  symbol: string;
  height?: number;
  width?: string;
  showToolbar?: boolean;
  lightweight?: boolean;
  interval?: string;
  isBuy?: boolean; // Add prop to determine up/down color scheme
}

let scriptLoaded = false;

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol,
  height = 180,
  width = "100%",
  showToolbar = false,
  lightweight = false,
  interval = "15", // Default to 15min chart
  isBuy = true, // Default to buy/long direction colors
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Format the symbol correctly for TradingView (convert forex pairs)
  const formatSymbol = (input: string) => {
    // Common forex pairs need to be formatted as FX:EURUSD, etc.
    const forexRegex = /^([A-Z]{3})([A-Z]{3})$/;
    if (forexRegex.test(input)) {
      return `FX:${input}`;
    }

    // For stocks that might have exchange prefixes
    if (!input.includes(":")) {
      return `NASDAQ:${input}`;
    }

    return input;
  };

  useEffect(() => {
    // Load TradingView script once
    if (!scriptLoaded) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => {
        scriptLoaded = true;
        initWidget();
      };
      document.body.appendChild(script);
    } else {
      initWidget();
    }

    function initWidget() {
      if (containerRef.current && typeof window.TradingView !== "undefined") {
        // Clear previous widget if any
        containerRef.current.innerHTML = "";

        const formattedSymbol = formatSymbol(symbol);

        // Define colors based on theme and direction
        const upColor = "#10b981"; // emerald-500
        const downColor = "#ef4444"; // rose-500

        // Chart background colors
        const chartBgDark = "#0f172a"; // slate-900
        const chartBgLight = "#ffffff"; // white

        // Text colors
        const textDark = "#94a3b8"; // slate-400
        const textLight = "#334155"; // slate-700

        // Choose the direction color based on isBuy prop
        const lineColor = isBuy ? upColor : downColor;

        new window.TradingView.widget({
          autosize: true,
          symbol: formattedSymbol,
          interval: interval,
          timezone: "Etc/UTC",
          theme: theme === "dark" ? "dark" : "light",
          style: lightweight ? "8" : "1", // Style 8 is the "line" style (much simpler)
          locale: "en",
          toolbar_bg: theme === "dark" ? "#1e293b" : "#f8fafc", // slate-800 : slate-50
          enable_publishing: false,
          allow_symbol_change: false,
          container_id: containerRef.current.id,
          hide_top_toolbar: true,
          hide_side_toolbar: true,
          hide_legend: lightweight,
          hide_volume: lightweight,
          save_image: false,
          studies: lightweight ? [] : ["RSI@tv-basicstudies"],
          drawings_access: { type: "none" },
          range: lightweight ? "1M" : "3M",
          height,
          width,
          // Custom colors to match app theme
          overrides: {
            // Main chart colors
            "mainSeriesProperties.candleStyle.upColor": upColor,
            "mainSeriesProperties.candleStyle.downColor": downColor,
            "mainSeriesProperties.candleStyle.wickUpColor": upColor,
            "mainSeriesProperties.candleStyle.wickDownColor": downColor,
            "mainSeriesProperties.candleStyle.borderUpColor": upColor,
            "mainSeriesProperties.candleStyle.borderDownColor": downColor,

            // For line charts
            "mainSeriesProperties.lineStyle.color": lineColor,

            // Background and text
            "paneProperties.background":
              theme === "dark" ? chartBgDark : chartBgLight,
            "paneProperties.vertGridProperties.color":
              theme === "dark" ? "#1e293b" : "#f1f5f9", // slate-800 : slate-100
            "paneProperties.horzGridProperties.color":
              theme === "dark" ? "#1e293b" : "#f1f5f9", // slate-800 : slate-100
            "scalesProperties.textColor":
              theme === "dark" ? textDark : textLight,
          },
        });

        // Add a small label to show the timeframe - changed position to left
        const timeframeLabel = document.createElement("div");
        timeframeLabel.textContent = "15m Chart";
        timeframeLabel.style.position = "absolute";
        timeframeLabel.style.left = "10px"; // Changed from right to left
        timeframeLabel.style.top = "5px";
        timeframeLabel.style.fontSize = "10px";
        timeframeLabel.style.padding = "2px 4px";
        timeframeLabel.style.borderRadius = "4px";
        timeframeLabel.style.color = theme === "dark" ? "#94a3b8" : "#334155"; // slate-400 : slate-700
        timeframeLabel.style.backgroundColor =
          theme === "dark" ? "#1e293b80" : "#f1f5f980"; // semi-transparent slate-800 : slate-100
        timeframeLabel.style.zIndex = "50";

        // Add the label to the container after a short delay to ensure the chart has rendered
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.appendChild(timeframeLabel);
          }
        }, 1000);
      }
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, theme, height, width, showToolbar, lightweight, interval, isBuy]);

  const containerId = `tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <div
        id={containerId}
        ref={containerRef}
        style={{ height, width }}
        className="tradingview-widget-container"
      />
    </div>
  );
};

export default TradingViewWidget;
