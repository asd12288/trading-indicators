"use client";

import { useTheme } from "@/context/theme-context";
import { useEffect, useRef } from "react";

interface TradingViewWidgetProps {
  symbol: string;
  height?: number;
  width?: string;
  showToolbar?: boolean;
  lightweight?: boolean; // New prop for simplified chart
  interval?: string; // New prop to control timeframe
}

let scriptLoaded = false;

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol,
  height = 180, // Reduced default height from 300 to 180
  width = "100%",
  showToolbar = false,
  lightweight = false, // Default to regular mode
  interval = "60", // Default to 60min chart (less data than daily)
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
        
        new window.TradingView.widget({
          autosize: true,
          symbol: formattedSymbol,
          interval: interval,
          timezone: "Etc/UTC",
          theme: theme === "dark" ? "dark" : "light",
          // Use a simpler chart style for lightweight mode
          style: lightweight ? "8" : "1", // Style 8 is the "line" style (much simpler)
          locale: "en",
          toolbar_bg: theme === "dark" ? "#1e293b" : "#f8fafc",
          enable_publishing: false,
          allow_symbol_change: false,
          container_id: containerRef.current.id,
          hide_top_toolbar: true, // Always hide top toolbar for compactness
          hide_side_toolbar: true,
          hide_legend: lightweight, // Hide legend in lightweight mode
          hide_volume: lightweight, // Hide volume in lightweight mode
          save_image: false,
          // Simplified settings for lightweight mode
          studies: lightweight ? [] : ["RSI@tv-basicstudies"],
          drawings_access: { type: 'none' },
          // Adjust range for less data
          range: lightweight ? "1M" : "3M",
          height,
          width,
        });
      }
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, theme, height, width, showToolbar, lightweight, interval]);

  const containerId = `tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
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
