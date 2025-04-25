"use client";

import React, { useState } from 'react';
import ForexLivePrice from '../../../../components/ForexLivePrice';
import { useSearchParams } from 'next/navigation';

const forexPairs = [
  'EUR/USD',
  'GBP/USD',
  'USD/JPY',
  'AUD/USD',
  'USD/CAD',
  'USD/CHF',
  'EUR/GBP'
];

export default function TwelveDataDemo() {
  // Get API key from URL parameter for convenience
  const searchParams = useSearchParams();
  const apiKeyFromUrl = searchParams.get('apiKey') || '';
  
  const [apiKey, setApiKey] = useState<string>(apiKeyFromUrl);
  const [savedApiKey, setSavedApiKey] = useState<string>(apiKeyFromUrl);
  const [selectedPairs, setSelectedPairs] = useState<string[]>(['EUR/USD']);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedApiKey(apiKey);
  };

  const toggleForexPair = (pair: string) => {
    setSelectedPairs(prev => {
      if (prev.includes(pair)) {
        return prev.filter(p => p !== pair);
      } else {
        if (prev.length < 5) { // Limit to 5 pairs to avoid overloading
          return [...prev, pair];
        }
        return prev;
      }
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">TwelveData WebSocket Demo</h1>
      <p className="text-gray-600 mb-6">Real-time forex prices using WebSocket connection</p>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">API Key Configuration</h2>
        <form onSubmit={handleApiKeySubmit} className="flex gap-2">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your TwelveData API key"
            className="flex-grow px-4 py-2 border rounded"
          />
          <button 
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save API Key
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-2">
          You can get your API key from <a href="https://twelvedata.com/account" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">TwelveData Account Page</a>
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Forex Pairs (max 5)</h2>
        <div className="flex flex-wrap gap-2">
          {forexPairs.map(pair => (
            <button
              key={pair}
              onClick={() => toggleForexPair(pair)}
              className={`px-3 py-1 rounded ${
                selectedPairs.includes(pair) 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {pair}
            </button>
          ))}
        </div>
      </div>

      {!savedApiKey && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8">
          <p>Please enter your TwelveData API key to start receiving live data.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedApiKey && selectedPairs.map(pair => (
          <ForexLivePrice 
            key={pair}
            symbol={pair}
            apiKey={savedApiKey}
          />
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Implementation Notes</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>WebSockets provide real-time price updates with lower latency than REST APIs</li>
          <li>TwelveData limits free tier accounts to 8 simultaneous symbol subscriptions</li>
          <li>The connection will automatically attempt to reconnect if disconnected</li>
          <li>Visual indicators show price movement direction (green for up, red for down)</li>
          <li>Price history is tracked for the last 30 updates</li>
        </ul>
      </div>
    </div>
  );
}