export interface InstrumentInfo {
  id?: number;
  instrument_name: string;
  full_name: string;
  contract_size: string;
  tick_size: string;
  tick_value: string;
  exchange: string;
  basic_info?: string;
  external_link?: string;
  margin_requirement?: string;
  trading_hours?: string;
  volatility_level?: string;
}
