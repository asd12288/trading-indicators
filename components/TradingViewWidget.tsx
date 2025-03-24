"use client";

import { useTheme } from "@/context/theme-context";
import { useEffect, useRef } from "react";

interface TradingViewWidgetProps {
  symbol: string;
  height?: number;
  width?: string;
  showToolbar?: boolean;
}

let scriptLoaded = false;

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol,
  height = 300,
  width = "100%",
  showToolbar = false,
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
          interval: "D",
          timezone: "Etc/UTC",
          theme: theme === "dark" ? "dark" : "light",
          style: "1",
          locale: "en",
          toolbar_bg: theme === "dark" ? "#1e293b" : "#f8fafc",
          enable_publishing: false,
          allow_symbol_change: false,
          container_id: containerRef.current.id,
          hide_top_toolbar: !showToolbar,
          hide_side_toolbar: true,
          save_image: false,
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
  }, [symbol, theme, height, width, showToolbar]);

  const containerId = `tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div className="w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
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
