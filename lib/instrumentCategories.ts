// instrumentCategories.ts

// Map each instrument_name (e.g. "ES") to a top-level category.
// For example, ES → "futures", 6E → "futures", MES → "micro_futures", etc.
// For Forex, we assume something like "EUR/USD" → "forex" and so on.
// For Crypto, "BTC" → "crypto", etc.

export const instrumentCategoryMap: Record<string, string> = {
  // ----- Futures: Stock Index Futures -----
  ES: "futures",
  NQ: "futures",
  YM: "futures",
  RTY: "futures",
  FDAX: "futures",
  FESX: "futures",

  // ----- Futures: Currency Futures -----
  "6E": "futures",
  "6B": "futures",
  "6J": "futures",
  "6A": "futures",
  "6C": "futures",
  "6S": "futures",
  "6M": "futures",

  // ----- Futures: Commodity Futures (Energy) -----
  CL: "futures",
  BZ: "futures",
  NG: "futures",

  // ----- Futures: Commodity Futures (Precious Metals) -----
  GC: "futures",
  SI: "futures",
  PL: "futures",
  PA: "futures",

  // ----- Futures: Commodity Futures (Agricultural) -----
  ZW: "futures",
  ZC: "futures",
  ZS: "futures",
  KC: "futures",
  CT: "futures",

  // ----- Futures: Interest Rate Futures -----
  ZT: "futures",
  ZF: "futures",
  ZN: "futures",
  ZB: "futures",

  // ----- Micro Futures: Stock Index -----
  MES: "micro_futures",
  MNQ: "micro_futures",
  MYM: "micro_futures",
  M2K: "micro_futures",
  FDXM: "micro_futures",

  // ----- Micro Futures: Currency -----
  M6E: "micro_futures",
  M6B: "micro_futures",
  M6J: "micro_futures",
  M6A: "micro_futures",
  M6C: "micro_futures",
  M6S: "micro_futures",

  // ----- Micro Futures: Commodity -----
  MGC: "micro_futures",
  SIL: "micro_futures",
  MCL: "micro_futures",

  // ----- Forex (Spot Market) - Major Pairs -----
  "EURUSD": "forex",
  "USDJPY": "forex",
  "GBPUSD": "forex",
  "USDCHF": "forex",
  "USDCAD": "forex",
  "AUDUSD": "forex",
  "NZDUSD": "forex",

  //  ----- Forex - Minor Pairs (Crosses) -----
  "EURGBP": "forex",
  "EURJPY": "forex",
  "GBPJPY": "forex",
  "EURCHF": "forex",
  "GBPCHF": "forex",
  "EURAUD": "forex",
  "EURCAD": "forex",
  "AUDJPY": "forex",
  "CADJPY": "forex",
  "NZDJPY": "forex",
  "GBPAUD": "forex",
  "GBPCAD": "forex",
  "AUDCAD": "forex",
  "AUDCHF": "forex",
  "AUDNZD": "forex",
  "EURNZD": "forex",
  "CHFJPY": "forex",

  //  ----- Forex - Exotic Pairs -----
  "USDSEK": "forex",
  "USDNOK": "forex",
  "USDDKK": "forex",
  "USDSGD": "forex",
  "USDHKD": "forex",
  "USDTRY": "forex",
  "USDZAR": "forex",
  "USDMXN": "forex",
  "USDPLN": "forex",
  "USDHUF": "forex",
  "USDCZK": "forex",
  "USDILS": "forex",
  "USDBRL": "forex",
  "USDRUB": "forex",
  "USDINR": "forex",
  "USDCNH": "forex",
  "USDTHB": "forex",

  //  ----- Forex - Minor-Exotic Crosses -----
  "EURTRY": "forex",
  "EURZAR": "forex",
  "EURHUF": "forex",
  "EURPLN": "forex",
  "GBPZAR": "forex",
  "NZDCHF": "forex",
  "CADCHF": "forex",

  // ----- Cryptocurrencies -----
  BTC: "crypto",
  ETH: "crypto",
  USDT: "crypto",
  BNB: "crypto",
  SOL: "crypto",

  // Additional Instruments
  "BTC/USD": "crypto",
  "ETH/USD": "crypto",
  "SOL/USD": "crypto",
  AAPL: "stocks",
  MSFT: "stocks",
  GOOGL: "stocks",
  GOLD: "commodities",
  OIL: "commodities",
  SILVER: "commodities",
};

// Standardizing categories format
export const instrumentCategories = [
  "futures",
  "micro_futures",
  "forex",
  "crypto",
  "stocks",
  "commodities",
];

export const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Futures", value: "futures" },
  { label: "Micro Futures", value: "micro_futures" },
  { label: "Forex", value: "forex" },
  { label: "Crypto", value: "crypto" },
  { label: "Stocks", value: "stocks" },
  { label: "Commodities", value: "commodities" },
];

export const SUBCATEGORIESFUTURE = [
  { label: "All", value: "all" },
  { label: "Stock Index Futures", value: "stock_index_futures" },
  { label: "Currency Futures", value: "currency_futures" },
  { label: "Commodity Futures (Energy)", value: "commodity_futures_energy" },
  {
    label: "Commodity Futures (Precious Metals)",
    value: "commodity_futures_precious_metals",
  },
  {
    label: "Commodity Futures (Agricultural)",
    value: "commodity_futures_agricultural",
  },
  { label: "Interest Rate Futures", value: "interest_rate_futures" },
];

export function getInstrumentCategory(instrumentName: string): string {
  return instrumentCategoryMap[instrumentName] || "unknown";
}
