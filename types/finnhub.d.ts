declare module "finnhub" {
  export interface EconomicCalendarItem {
    actual?: number | string;
    country: string;
    estimate?: number | string;
    event: string;
    impact: number | string;
    prev?: number | string;
    time: string;
    unit?: string;
    date?: string;
  }

  export interface EconomicCalendarResponse {
    economicCalendar: EconomicCalendarItem[];
  }

  export class DefaultApi {
    apiKey: string;

    /**
     * Get economic calendar events
     * @param from - From date YYYY-MM-DD
     * @param to - To date YYYY-MM-DD
     * @param callback - Callback function
     */
    economicCalendar(
      from: string,
      to: string,
      callback: (
        error: Error | null,
        data: EconomicCalendarResponse,
        response: any,
      ) => void,
    ): void;

    // Add other Finnhub methods as needed
  }

  // Default export
  const finnhub: {
    DefaultApi: typeof DefaultApi;
  };

  export default finnhub;
}
