"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Type for the price data from TwelveData WebSocket
export interface TwelveDataPrice {
  event: string;
  symbol: string;
  currency?: string;
  currency_base?: string;
  currency_quote?: string;
  type?: string;
  timestamp: number;
  price: number;
  bid?: number;
  ask?: number;
  day_volume?: number;
}

// Hook options
interface UseTwelveDataWebSocketOptions {
  apiKey: string;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  onError?: (error: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

// Events emitted by the hook
type PriceDirection = "up" | "down" | "neutral";

// Return value from the hook
interface UseTwelveDataWebSocketReturn {
  lastPrice: { last: number } | null;
  priceHistory: number[];
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  priceDirection: PriceDirection;
  source: string;
  lastUpdated: Date | null;
  forceReconnect: () => void;
  hasError: boolean;
}

// Base WebSocket URL
const WEBSOCKET_URL = "wss://ws.twelvedata.com/v1/quotes/price";

export default function useTwelveDataWebSocket(
  symbol: string,
  options: UseTwelveDataWebSocketOptions,
): UseTwelveDataWebSocketReturn {
  // Connection state
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Price state
  const [priceData, setPriceData] = useState<TwelveDataPrice | null>(null);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [priceDirection, setPriceDirection] =
    useState<PriceDirection>("neutral");

  // Keep reference to previous price for direction detection
  const prevPriceRef = useRef<number | null>(null);

  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);

  // Set defaults for options
  const {
    apiKey,
    reconnectInterval = 5000,
    reconnectAttempts = 5,
    onError,
    onConnect,
    onDisconnect,
  } = options;

  // Helper to update price direction
  useEffect(() => {
    if (priceData?.price && prevPriceRef.current !== null) {
      if (priceData.price > prevPriceRef.current) {
        setPriceDirection("up");
      } else if (priceData.price < prevPriceRef.current) {
        setPriceDirection("down");
      }
    }

    if (priceData?.price) {
      prevPriceRef.current = priceData.price;

      // Update price history
      setPriceHistory((prev) => {
        const newHistory = [...prev, priceData.price];
        // Keep only the last 30 price points
        return newHistory.slice(-30);
      });
    }
  }, [priceData?.price]);

  // Connect to WebSocket function
  const connect = useCallback(() => {
    if (!symbol || !apiKey) return;

    // Clean up any existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      // Create new WebSocket connection
      wsRef.current = new WebSocket(WEBSOCKET_URL);
      setIsLoading(true);

      // Handle connection open
      wsRef.current.onopen = () => {
        console.log("WebSocket connected to TwelveData");
        setIsConnected(true);
        setIsLoading(false);
        setError(null);
        reconnectAttemptsRef.current = 0;

        if (onConnect) onConnect();

        // Send authentication message
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              action: "subscribe",
              params: {
                symbols: symbol,
                apikey: apiKey,
              },
            }),
          );
        }
      };

      // Handle incoming messages
      wsRef.current.onmessage = (event) => {
        try {
          const data: TwelveDataPrice = JSON.parse(event.data);
          setPriceData(data);
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      // Handle errors
      wsRef.current.onerror = (event) => {
        console.error("WebSocket error:", event);
        setError(new Error("WebSocket connection error"));
        if (onError) onError(event);
      };

      // Handle connection close
      wsRef.current.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setIsConnected(false);

        if (onDisconnect) onDisconnect();

        // Attempt to reconnect unless the connection was closed intentionally
        if (
          event.code !== 1000 &&
          reconnectAttemptsRef.current < reconnectAttempts
        ) {
          console.log(
            `Attempting to reconnect (${reconnectAttemptsRef.current + 1}/${reconnectAttempts})...`,
          );

          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, reconnectInterval);
        }
      };
    } catch (err) {
      console.error("Failed to create WebSocket connection:", err);
      setError(
        err instanceof Error ? err : new Error("Unknown WebSocket error"),
      );
      setIsLoading(false);
      if (onError) onError(err);
    }
  }, [
    symbol,
    apiKey,
    reconnectInterval,
    reconnectAttempts,
    onConnect,
    onDisconnect,
    onError,
  ]);

  // Connect on mount and when dependencies change
  useEffect(() => {
    connect();

    // Clean up on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounted");
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  // Force reconnect function
  const forceReconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  return {
    lastPrice: priceData ? { last: priceData.price } : null,
    priceHistory,
    isConnected,
    isLoading,
    error,
    priceDirection,
    source: "TwelveData WebSocket",
    lastUpdated: priceData?.timestamp
      ? new Date(priceData.timestamp * 1000)
      : null,
    forceReconnect,
    hasError: !!error,
  };
}
