export interface InstrumentInfo {
  instrument_name: string;
  full_name: string;
  basic_info: string;
  exchange: string;
  trading_hours: string;
  contract_size: string;
  tick_size: string;
  tick_value: string;
  volatility_level: string;
  external_link: string;
}

export interface Signal {
  client_trade_id: string;
  instrument_name: string;
  trade_side: "Long" | "Short";
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
}
