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
  trade_side: "Long" | "Short" | "Buy" | "Sell";
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

export interface Alert {
  id: string;
  message: string;
  trade_side: "LONG" | "SHORT";
  instrument_name: string;
  created_at: string;
  time: string;
  price: number;
  time_utc: string;
  VWAP: string;
  value: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  subTitle: string;
  imageUrl: string;
}

export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  created_at: string;
  plan?: "pro" | "free";
  role?: "admin" | "user";
  preferences: PreferenceValues;
}

export interface PreferenceValues {
  notifications: boolean;
  volume: boolean;
  favorite: boolean;
}

export interface BlogProps {
  blog: {
    title: string;
    content: string;
    id: string | number;
    imageUrl: string;
    subTitle: string;
  };
}
