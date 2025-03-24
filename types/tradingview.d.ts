interface TradingViewWidget {
  widget(config: {
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
  }): void;
}

declare global {
  interface Window {
    TradingView: TradingViewWidget;
  }
}

export {};
