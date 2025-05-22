export interface Signal {
  client_trade_id: string;
  instrument_name: string;
  trade_side:
    | "Long"
    | "Short"
    | "Buy"
    | "Sell"
    | "LONG"
    | "SHORT"
    | "BUY"
    | "SELL";
  entry_price: number;
  entry_time: string;
  exit_price: number | null;
  exit_time: string | null;
  mae: number;
  mfe: number;
  result_ticks: number;
  trade_duration: string;
  take_profit_price: number;
  stop_loss_price: number;
  signal: string;
  account_name?: string;
  daily_pnl?: number;
}
