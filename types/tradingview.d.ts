interface TradingViewWidgetConfig {
  autosize: boolean;
  symbol: string;
  interval: string;
  timezone: string;
  theme: string;
  style: string;
  locale: string;
  toolbar_bg: string;
  enable_publishing: boolean;
  allow_symbol_change: boolean;
  container_id: string;
  hide_top_toolbar: boolean;
  hide_side_toolbar: boolean;
  hide_legend?: boolean;
  hide_volume?: boolean;
  save_image: boolean;
  studies?: string[];
  drawings_access?: { type: string };
  range?: string;
  height: number;
  width: string | number;
  overrides?: {
    [key: string]: string | number | boolean;
  };
}

interface TradingViewNewsWidgetConfig {
  width: string | number;
  height: number;
  colorTheme: string;
  isTransparent: boolean;
  displayMode: string;
  locale: string;
  importanceFilter?: string;
  symbols?: string[];
  showHeader?: boolean;
  newsCategories?: string[];
  newsCount?: number;
  backgroundColor?: string;
  textColor?: string;
}

// Define the widget constructor interface
interface TradingViewWidgetConstructor {
  new (config: TradingViewWidgetConfig): any;
}

interface TradingViewWidget {
  widget: TradingViewWidgetConstructor;
}

declare global {
  interface Window {
    TradingView: TradingViewWidget;
  }
}

export {};
