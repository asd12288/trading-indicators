const API_KEY = process.env.ALPHA_VANTAGE_API_KEY; // Store API key in .env

export async function fetchLatestNews(symbol: string) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${API_KEY}`
    );

    if (!response.ok) throw new Error("Failed to fetch news");

    const data = await response.json();

    // Alpha Vantage returns an array under "feed"
    return data.feed ? data.feed.slice(0, 5) : [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}
