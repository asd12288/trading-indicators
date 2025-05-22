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
