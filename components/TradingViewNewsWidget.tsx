"use client";

import { useEffect, useRef } from "react";

interface TradingViewNewsWidgetProps {
  symbol?: string;
  height?: number;
  width?: string | number;
  showHeader?: boolean;
  newsCount?: number; // Add option to control number of news items
}

const TradingViewNewsWidget: React.FC<TradingViewNewsWidgetProps> = ({
  symbol,
  height = 500,
  width = "100%",
  showHeader = false,
  newsCount = 20, // Show more news by default
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = "dark";

  // Format symbol for TradingView if provided
  const formatSymbol = (input?: string): string | undefined => {
    if (!input) return undefined;

    // Format forex pairs as FX:EURUSD
    if (/^[A-Z]{3}[A-Z]{3}$/.test(input)) {
      return `FX:${input}`;
    }

    // Add NASDAQ prefix for simple stock symbols
    if (input && !input.includes(":")) {
      return `NASDAQ:${input}`;
    }

    return input;
  };

  useEffect(() => {
    // Only run this effect on the client
    if (typeof window === "undefined") return;

    // Clean up any existing widget
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    // Create container ID that's unique
    const containerId = `tradingview_news_${symbol ? symbol.replace(/[^a-zA-Z0-9]/g, "") : "general"}_${Math.random().toString(36).substring(2, 9)}`;

    // Set the ID on the ref
    if (containerRef.current) {
      containerRef.current.id = containerId;
    }

    // Prepare widget config
    const formattedSymbol = formatSymbol(symbol);

    // Create a properly formatted JSON string
    const configJSON = JSON.stringify({
      width: width,
      height: height,
      colorTheme: theme === "dark" ? "dark" : "light",
      isTransparent: true,
      displayMode: "compact",
      locale: "en",
      importanceFilter: "0,1",
      ...(formattedSymbol ? { symbols: [formattedSymbol] } : {}),
      showHeader: showHeader,
      newsCategories: ["headlines", "economy", "stock", "forex"],
      newsCount: newsCount,
      backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
      textColor: theme === "dark" ? "#94a3b8" : "#334155",
    });

    // Create script element with proper JSON
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.innerHTML = configJSON;

    // Add script to container
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, height, width, theme, showHeader, newsCount]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <div
        className="tradingview-widget-container"
        ref={containerRef}
        style={{ height, width }}
      />
    </div>
  );
};

export default TradingViewNewsWidget;
