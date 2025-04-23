"use client";

import React, { useEffect, useRef, useState, useMemo } from "react"; // React imported
import { useTheme } from "@/context/theme-context";

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
  interval = "30", // Default to 30 minute chart
  isBuy = true,
  demo = false, // Default to false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Add states for loading and error handling
  const [, setIsLoading] = useState(true); // isLoading not used directly
  const [hasError, setHasError] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);

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

  // Function to retry loading the chart
  const retryLoadChart = () => {
    if (loadAttempts < 3) {
      setHasError(false);
      setLoadAttempts((prev) => prev + 1);

      // Clean up existing widget
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      // Re-initialize the widget
      initWidget();
    }
  };

  // Function to render a fallback chart
  const renderFallbackChart = () => {
    if (!containerRef.current) return;

    // Clear container
    containerRef.current.innerHTML = "";

    // Create fallback chart container
    const fallbackChart = document.createElement("div");
    fallbackChart.style.height = height + "px";
    fallbackChart.style.width = "100%";
    fallbackChart.style.display = "flex";
    fallbackChart.style.flexDirection = "column";
    fallbackChart.style.alignItems = "center";
    fallbackChart.style.justifyContent = "center";
    fallbackChart.style.backgroundColor =
      theme === "dark" ? "#0f172a" : "#ffffff";
    fallbackChart.style.color = theme === "dark" ? "#94a3b8" : "#334155";
    fallbackChart.style.borderRadius = "4px";

    // Add error icon and message
    if (hasError) {
      const errorMsg = document.createElement("div");
      errorMsg.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="2" y1="2" x2="22" y2="22"></line>
            <path d="M10 10c.5-.5 1.143-.8 2-.8 1.9 0 3 1.1 3 3v1"></path>
            <path d="M17 17c.5.5 1 1 1 2a2 2 0 0 1-4 0c0-1 .5-1.5 1-2Z"></path>
            <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
            <path d="M21 7V5a2 2 0 0 0-2-2h-2"></path>
            <path d="M3 17v2a2 2 0 0 0 2 2h2"></path>
            <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
          </svg>
          <span style="margin-top: 4px; font-size: 14px;">Chart unavailable</span>
          <button id="retry-btn" style="
            margin-top: 8px;
            background-color: ${theme === "dark" ? "#334155" : "#e2e8f0"};
            color: ${theme === "dark" ? "#e2e8f0" : "#334155"};
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            cursor: pointer;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
            Retry
          </button>
        </div>
      `;
      fallbackChart.appendChild(errorMsg);

      // Add event listener for retry button after the element is added to DOM
      setTimeout(() => {
        const retryBtn = document.getElementById("retry-btn");
        if (retryBtn) {
          retryBtn.addEventListener("click", retryLoadChart);
        }
      }, 0);
    } else {
      // Loading state
      fallbackChart.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <div style="width: 30px; height: 30px;" class="animate-spin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
          </div>
          <span style="font-size: 14px; margin-top: 8px;">Loading chart...</span>
        </div>
      `;
    }

    containerRef.current.appendChild(fallbackChart);

    // Add price indicator if it's a demo chart
    if (demo) {
      const priceLabel = document.createElement("div");
      priceLabel.style.position = "absolute";
      priceLabel.style.top = "8px";
      priceLabel.style.right = "8px";
      priceLabel.style.padding = "4px 8px";
      priceLabel.style.borderRadius = "4px";
      priceLabel.style.backgroundColor = isBuy ? "#059669" : "#e11d48";
      priceLabel.style.color = "#ffffff";
      priceLabel.style.fontWeight = "bold";
      priceLabel.style.fontSize = "12px";
      priceLabel.style.display = "flex";
      priceLabel.style.alignItems = "center";
      priceLabel.style.gap = "4px";

      priceLabel.innerHTML = isBuy
        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg> Demo'
        : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7 7 7-7"/><path d="M12 5v14"/></svg> Demo';

      containerRef.current.appendChild(priceLabel);
    }
  };

  // Function to initialize the widget
  function initWidget() {
    if (!containerRef.current) return;

    // Skip loading real chart if in demo mode
    if (demo) {
      setIsLoading(false);
      renderFallbackChart();
      return;
    }

    // If TradingView script is not loaded or there was an error loading it
    if (typeof window === "undefined" || !window.TradingView) {
      setIsLoading(false);
      setHasError(true);
      renderFallbackChart();
      return;
    }

    try {
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const TVWidget = window.TradingView.widget as any;

      // Set a timeout to detect if the widget doesn't load within a reasonable time
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        setHasError(true);
        renderFallbackChart();
      }, 10000); // 10 seconds timeout

      // Create the widget
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
        hide_top_toolbar: !showToolbar,
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
        // Add loading callback
        loading_screen: {
          backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
        },
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
          "scalesProperties.textColor": theme === "dark" ? textDark : textLight,
        },
        // Add callbacks for loading and error states
        onChartReady: () => {
          clearTimeout(timeoutId);
          setIsLoading(false);
          setHasError(false);

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
          }, 100);
        },
      });
    } catch (error) {
      console.error("Error initializing TradingView widget:", error);
      setIsLoading(false);
      setHasError(true);
      renderFallbackChart();
    }
  }

  // Generate a stable container ID for this widget instance, changes only when symbol changes
  const containerIdRef = useMemo(() => {
    const rand = Math.random().toString(36).substring(2, 5);
    return `tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, "")}_${rand}`;
  }, [symbol]);

  // Only initialize or re-render chart when symbol or demo flag changes
  useEffect(() => {
    if (demo) {
      // In demo mode, show fallback chart once
      renderFallbackChart();
    } else {
      // Load script if needed or initialize widget
      if (!scriptLoaded) {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = () => {
          scriptLoaded = true;
          initWidget();
        };
        script.onerror = () => {
          console.error("Failed to load TradingView script");
          setIsLoading(false);
          setHasError(true);
          renderFallbackChart();
        };
        document.body.appendChild(script);
      } else {
        initWidget();
      }
    }
    const container = containerRef.current;
    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [symbol, demo, initWidget, renderFallbackChart]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <div
        id={containerIdRef}
        ref={containerRef}
        style={{ height, width, position: "relative" }}
        className="tradingview-widget-container"
      />
    </div>
  );
};

// Memoize component to prevent re-render unless symbol or demo changes
export default React.memo(
  TradingViewWidget,
  (prev, next) => prev.symbol === next.symbol && prev.demo === next.demo,
);
