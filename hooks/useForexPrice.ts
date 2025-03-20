import useLast from './useLast';

const useForexPrice = (instrumentName: string) => {
  // Use the useLast hook which now makes server-side API calls
  const {
    lastPrice,
    isLoading,
    error,
    lastUpdated,
    refreshNow,
    isLive,
    source,
    direction,
    forceRefresh
  } = useLast(instrumentName);
  
  // Calculate bid/ask with a typical spread (if needed)
  let formattedPrice = null;
  if (lastPrice?.last) {
    const last = lastPrice.last;
    const spread = last * 0.0001; // Typical 1 pip spread
    
    formattedPrice = {
      last,
      bid: last - spread/2,
      ask: last + spread/2
    };
  }
  
  return {
    lastPrice: formattedPrice,
    isLoading,
    error,
    lastUpdated,
    refreshNow: forceRefresh, // Use the cache-purging refresh for more immediate updates
    isLive,
    source,
    priceDirection: direction
  };
};

export default useForexPrice;
