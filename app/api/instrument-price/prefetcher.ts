import { createClient } from "@/database/supabase/server";
import { PRICE_CACHE_CONFIG, POPULAR_INSTRUMENTS, priceCache } from "./config";

/**
 * Prefetches data for popular instruments to keep the cache warm
 * This helps reduce timeouts for commonly requested instruments by
 * fetching them on a regular interval rather than on-demand
 */
export class InstrumentPrefetcher {
  private timer: NodeJS.Timeout | null = null;
  private isRunning = false;
  private intervalMs = 30000; // 30 seconds between prefetch cycles

  constructor(
    private instruments = POPULAR_INSTRUMENTS,
    private fetchCount = PRICE_CACHE_CONFIG.PREFETCH_COUNT,
  ) {}

  /**
   * Start the prefetcher
   */
  public start(): void {
    if (this.timer) {
      return; // Already running
    }
    console.log("Starting instrument prefetcher");
    this.schedulePrefetch();
  }

  /**
   * Stop the prefetcher
   */
  public stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
      console.log("Instrument prefetcher stopped");
    }
  }

  /**
   * Schedule next prefetch cycle
   */
  private schedulePrefetch(): void {
    this.timer = setTimeout(async () => {
      if (!this.isRunning) {
        try {
          this.isRunning = true;
          await this.prefetchInstruments();
        } catch (error) {
          console.error("Error in prefetcher:", error);
        } finally {
          this.isRunning = false;
        }
      }
      this.schedulePrefetch();
    }, this.intervalMs);
  }

  /**
   * Prefetch a batch of instruments
   */
  private async prefetchInstruments(): Promise<void> {
    // Select random instruments from the popular list
    const instrumentsToFetch = this.getRandomInstruments();

    if (instrumentsToFetch.length === 0) {
      return;
    }

    console.log(
      `Prefetching ${instrumentsToFetch.length} instruments: ${instrumentsToFetch.join(", ")}`,
    );

    const supabase = await createClient();

    // Fetch multiple instruments in parallel with individual timeouts
    await Promise.allSettled(
      instrumentsToFetch.map(async (instrument) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            controller.abort();
          }, PRICE_CACHE_CONFIG.QUERY_TIMEOUT);

          // Fetch latest price
          const { data, error } = await supabase
            .from("instruments_status")
            .select("last, timestamp, instrument_name")
            .eq("instrument_name", instrument)
            .order("timestamp", { ascending: false })
            .limit(1);

          clearTimeout(timeoutId);

          if (error) {
            console.warn(`Prefetch error for ${instrument}:`, error);
            return;
          }

          if (!data || data.length === 0) {
            console.log(
              `No price data found for ${instrument} during prefetch`,
            );
            return;
          }

          // Update the cache
          const now = Date.now();
          priceCache[instrument] = {
            data: {
              ...data[0],
              priceHistory: priceCache[instrument]?.data?.priceHistory || [
                data[0].last,
              ],
            },
            fetchedAt: now,
          };

          console.log(`Prefetched ${instrument}`);
        } catch (error) {
          console.error(`Error prefetching ${instrument}:`, error);
        }
      }),
    );
  }

  /**
   * Get a random selection of instruments to prefetch
   */
  private getRandomInstruments(): string[] {
    if (this.instruments.length <= this.fetchCount) {
      return [...this.instruments];
    }

    const shuffled = [...this.instruments].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, this.fetchCount);
  }
}

// Export a singleton instance
export const prefetcher = new InstrumentPrefetcher();

// Auto-start in production environments
if (process.env.NODE_ENV === "production") {
  prefetcher.start();
}
