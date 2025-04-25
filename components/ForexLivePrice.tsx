"use client";

import React, { useState } from "react";
import useTwelveDataWebSocket from "../hooks/useTwelveDataWebSocket";

interface ForexLivePriceProps {
  symbol: string;
  apiKey: string;
}

const ForexLivePrice: React.FC<ForexLivePriceProps> = ({ symbol, apiKey }) => {
  const {
    lastPrice,
    priceHistory,
    isConnected,
    isLoading,
    priceDirection,
    source,
    lastUpdated,
    forceReconnect,
    hasError,
  } = useTwelveDataWebSocket(symbol, {
    apiKey,
    onError: (error) => console.error("WebSocket error:", error),
    onConnect: () => console.log("WebSocket connected"),
    onDisconnect: () => console.log("WebSocket disconnected"),
  });

  // Format the price with proper decimal places
  const formattedPrice = lastPrice?.last ? lastPrice.last.toFixed(4) : "-.----";

  // Determine class for price color based on direction
  const priceColorClass =
    priceDirection === "up"
      ? "text-green-500"
      : priceDirection === "down"
        ? "text-red-500"
        : "text-gray-700";

  // Format the last updated time
  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString()
    : "--:--:--";

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{symbol}</h2>
          <p className="text-sm text-gray-500">Source: {source}</p>
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`text-2xl font-bold ${priceColorClass} transition-colors duration-300`}
          >
            {formattedPrice}
          </span>
          <span className="text-xs text-gray-500">
            Last update: {formattedTime}
          </span>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <div
          className={`h-3 w-3 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span className="text-sm">
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* Price history visualization */}
      {priceHistory.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-medium">Price History</h3>
          <div className="flex h-20 items-end space-x-1">
            {priceHistory.map((price, index) => {
              const min = Math.min(...priceHistory);
              const max = Math.max(...priceHistory);
              const range = max - min;
              // Calculate height percentage (minimum 5% for visibility)
              const heightPercentage =
                range === 0 ? 50 : 5 + ((price - min) / range) * 95;

              // Color based on comparison to previous price
              const prevPrice = index > 0 ? priceHistory[index - 1] : price;
              const barColor =
                price >= prevPrice ? "bg-green-400" : "bg-red-400";

              return (
                <div
                  key={index}
                  className={`w-2 ${barColor} rounded-t`}
                  style={{ height: `${heightPercentage}%` }}
                  title={`${price.toFixed(5)}`}
                ></div>
              );
            })}
          </div>
        </div>
      )}

      {hasError && (
        <div className="mt-4 rounded bg-red-100 p-2 text-red-700">
          Connection error. Please check your API key or network connection.
          <button
            onClick={forceReconnect}
            className="ml-2 rounded bg-red-700 px-2 py-1 text-xs text-white"
          >
            Reconnect
          </button>
        </div>
      )}

      {isLoading && !hasError && (
        <div className="mt-4 flex justify-center">
          <div className="flex animate-pulse space-x-4">
            <div className="h-3 w-24 rounded bg-gray-200"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForexLivePrice;
