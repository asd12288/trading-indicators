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
  isBuy?: boolean;
  demo?: boolean; // Add demo prop
}

let scriptLoaded = false;

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol,
  height = 180,
  width = "100%",
  showToolbar = false,
  lightweight = true, // Default to lightweight mode
  interval = "30", // Default to 15 minute chart
  isBuy = true,
  demo = false, // Default to false
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
    // Skip loading real chart if in demo mode
    if (demo) {
      // Create a simple demo chart instead
      if (containerRef.current) {
        containerRef.current.innerHTML = "";

        // Create a mock chart container
        const mockChart = document.createElement("div");
        mockChart.style.height = height + "px";
        mockChart.style.width = "100%";
        mockChart.style.display = "flex";
        mockChart.style.alignItems = "center";
        mockChart.style.justifyContent = "center";
        mockChart.style.backgroundColor =
          theme === "dark" ? "#0f172a" : "#ffffff";
        mockChart.style.color = theme === "dark" ? "#94a3b8" : "#334155";
        mockChart.style.borderRadius = "4px";
        mockChart.textContent = "Demo Chart - " + interval + "m";

        containerRef.current.appendChild(mockChart);

        // Add the timeframe label
        const timeframeLabel = document.createElement("div");
        timeframeLabel.textContent = interval + "m Chart";
        timeframeLabel.style.position = "absolute";
        timeframeLabel.style.left = "10px";
        timeframeLabel.style.top = "5px";
        timeframeLabel.style.fontSize = "10px";
        timeframeLabel.style.padding = "2px 4px";
        timeframeLabel.style.borderRadius = "4px";
        timeframeLabel.style.color = theme === "dark" ? "#94a3b8" : "#334155";
        timeframeLabel.style.backgroundColor =
          theme === "dark" ? "#1e293b80" : "#f1f5f980";
        timeframeLabel.style.zIndex = "50";

        containerRef.current.appendChild(timeframeLabel);
      }
      return;
    }

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
      if (
        containerRef.current &&
        typeof window !== "undefined" &&
        window.TradingView
      ) {
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

        // Explicitly cast to any to avoid TypeScript errors
        // This is safe because we've already checked for window.TradingView existence
        const TVWidget = window.TradingView.widget as any;

        new TVWidget({
          autosize: true,
          symbol: formattedSymbol,
          interval: interval, // Ensure this uses the prop value
          timeframe: "1D", // Show only 1 day of data
          timezone: "Etc/UTC",
          theme: theme === "dark" ? "dark" : "light",
          style: lightweight ? "8" : "1", // Style 8 is line style
          locale: "en",
          toolbar_bg: theme === "dark" ? "#1e293b" : "#f8fafc",
          enable_publishing: false,
          allow_symbol_change: false,
          container_id: containerRef.current.id,
          hide_top_toolbar: true,
          hide_side_toolbar: true,
          hide_legend: true,
          hide_volume: true,
          saved_data: false,
          studies: [],
          show_popup_button: false,
          withdateranges: false,
          hide_drawing_toolbar: true,
          calendar: false,
          range: "1D", // Only show 1 day
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

        // Add a label to show the timeframe
        const timeframeLabel = document.createElement("div");
        timeframeLabel.textContent = interval + "m Chart"; // Use the actual interval
        timeframeLabel.style.position = "absolute";
        timeframeLabel.style.left = "10px";
        timeframeLabel.style.top = "5px";
        timeframeLabel.style.fontSize = "10px";
        timeframeLabel.style.padding = "2px 4px";
        timeframeLabel.style.borderRadius = "4px";
        timeframeLabel.style.color = theme === "dark" ? "#94a3b8" : "#334155";
        timeframeLabel.style.backgroundColor =
          theme === "dark" ? "#1e293b80" : "#f1f5f980";
        timeframeLabel.style.zIndex = "50";

        // Add the label after a delay to ensure the chart has rendered
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
  }, [
    symbol,
    theme,
    height,
    width,
    showToolbar,
    lightweight,
    interval,
    isBuy,
    demo,
  ]);

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
