import axios from "axios";

// Define the response interface based on the API you choose
export interface NewsItem {
  title: string;
  url: string;
  time_published: string;
  summary: string;
  banner_image: string | null;
  source: string;
}

/**
 * Fetches the latest news for a given instrument symbol
 * This implementation uses Alpha Vantage API (free tier with limitations)
 */
export async function fetchLatestNews(symbol: string): Promise<NewsItem[]> {
  try {
    // Map instrument symbols like NQ to their full tickers if needed
    const tickerMap: Record<string, string> = {
      NQ: "NQ=F", // Nasdaq futures
      ES: "ES=F", // S&P 500 futures
      YM: "YM=F", // Dow futures
      RTY: "RTY=F", // Russell 2000 futures
      CL: "CL=F", // Crude Oil
      GC: "GC=F", // Gold
      // Add more mappings as needed
    };

    const searchQuery = tickerMap[symbol] || symbol;

    // Alpha Vantage News API (requires API key)
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${searchQuery}&apikey=${apiKey}`,
    );

    // Transform the response to match our NewsItem interface
    if (response.data && response.data.feed) {
      return response.data.feed
        .map((item: any) => ({
          title: item.title,
          url: item.url,
          time_published: item.time_published,
          summary: item.summary,
          banner_image: item.banner_image || null,
          source: item.source,
        }))
        .slice(0, 5); // Limit to 5 news items
    }

    return [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

/**
 * Alternative implementation using Finnhub API
 */
export async function fetchNewsWithFinnhub(
  symbol: string,
): Promise<NewsItem[]> {
  try {
    // Map instrument symbols if needed
    const tickerMap: Record<string, string> = {
      NQ: "NQ",
      // Add more mappings as needed
    };

    const searchQuery = tickerMap[symbol] || symbol;

    // Get current date and date from 7 days ago
    const toDate = new Date().toISOString().split("T")[0];
    const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Finnhub API (requires API key)
    const apiKey = process.env.FINNHUB_API_KEY;
    const response = await axios.get(
      `https://finnhub.io/api/v1/company-news?symbol=${searchQuery}&from=${fromDate}&to=${toDate}&token=${apiKey}`,
    );

    // Transform the response to match our NewsItem interface
    if (response.data && Array.isArray(response.data)) {
      return response.data
        .map((item: any) => ({
          title: item.headline,
          url: item.url,
          time_published: new Date(item.datetime * 1000).toISOString(),
          summary: item.summary,
          banner_image: item.image || null,
          source: item.source,
        }))
        .slice(0, 5); // Limit to 5 news items
    }

    return [];
  } catch (error) {
    console.error("Error fetching news with Finnhub:", error);
    return [];
  }
}
