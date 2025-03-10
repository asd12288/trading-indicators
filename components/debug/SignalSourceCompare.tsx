"use client";

import React, { useEffect, useState } from 'react';
import supabaseClient from "@/database/supabase/supabase.js";
import { Button } from "../ui/button";

const SignalSourceCompare = () => {
  const [allSignals, setAllSignals] = useState([]);
  const [latestSignals, setLatestSignals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch from all_signals
      const { data: allData, error: allError } = await supabaseClient
        .from("all_signals")
        .select("*")
        .order("entry_time", { ascending: false });
        
      if (allError) throw allError;
      
      // Fetch from latest_signals_per_instrument
      const { data: latestData, error: latestError } = await supabaseClient
        .from("latest_signals_per_instrument")
        .select("*")
        .order("entry_time", { ascending: false });
        
      if (latestError) throw latestError;
      
      // Process to get latest per instrument manually (for comparison)
      const instrumentMap = new Map();
      allData.forEach(signal => {
        const instrument = signal.instrument_name;
        if (!instrumentMap.has(instrument) || 
            new Date(signal.entry_time) > new Date(instrumentMap.get(instrument).entry_time)) {
          instrumentMap.set(instrument, signal);
        }
      });
      
      const manuallyProcessed = Array.from(instrumentMap.values());
      
      console.log('All signals count:', allData.length);
      console.log('Latest signals table count:', latestData.length);
      console.log('Manually processed latest count:', manuallyProcessed.length);
      
      setAllSignals(allData);
      setLatestSignals(latestData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  // Find discrepancies between latest_signals_per_instrument and what should be there
  const missingOrWrongSignals = React.useMemo(() => {
    if (!allSignals.length) return [];
    
    // Create a map of what latest signals SHOULD be
    const instrumentMap = new Map();
    allSignals.forEach(signal => {
      const instrument = signal.instrument_name;
      if (!instrumentMap.has(instrument) || 
          new Date(signal.entry_time) > new Date(instrumentMap.get(instrument).entry_time)) {
        instrumentMap.set(instrument, signal);
      }
    });
    
    const correctLatest = Array.from(instrumentMap.values());
    
    // Find signals in correctLatest that are missing or different in latestSignals
    return correctLatest.filter(correct => {
      const found = latestSignals.find(s => s.instrument_name === correct.instrument_name);
      return !found || new Date(found.entry_time) < new Date(correct.entry_time);
    });
  }, [allSignals, latestSignals]);
  
  return (
    <div className="p-6 bg-slate-800/80 rounded-xl border border-slate-700 max-w-3xl mx-auto my-8">
      <h2 className="text-2xl font-semibold text-white mb-4">Signal Source Comparison</h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 text-red-400 p-4 rounded-md">
          Error: {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-700/40 rounded-md p-4">
              <h3 className="text-lg font-medium text-blue-400 mb-2">Total Signals</h3>
              <p className="text-white font-bold text-2xl">{allSignals.length}</p>
              <p className="text-slate-400 text-sm">Total signals</p>
            </div>
            
            <div className="bg-slate-700/40 rounded-md p-4">
              <h3 className="text-lg font-medium text-green-400 mb-2">Unique </h3>
              <p className="text-white font-bold text-2xl">{latestSignals.length}</p>
              <p className="text-slate-400 text-sm">Latest signals</p>
            </div>
          </div>
          
          {missingOrWrongSignals.length > 0 && (
            <div className="bg-amber-900/20 text-amber-400 p-4 rounded-md mb-6">
              <h3 className="text-lg font-medium mb-2">Issues Found: {missingOrWrongSignals.length}</h3>
              <p className="text-sm mb-2">
                The following signals are either missing or outdated in the latest_signals_per_instrument table:
              </p>
              <div className="max-h-60 overflow-y-auto bg-slate-900/50 rounded-md p-2">
                <ul className="space-y-2">
                  {missingOrWrongSignals.map(signal => (
                    <li key={signal.client_trade_id} className="text-xs border-b border-slate-700 pb-1">
                      <span className="font-medium">{signal.instrument_name}</span> - 
                      <span className="ml-1 text-slate-300">
                        {new Date(signal.entry_time).toLocaleString()}
                      </span>
                      <span className="ml-2 text-xs text-amber-500">
                        {signal.exit_price === null ? '(Running)' : '(Completed)'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          <div className="flex justify-center">
            <Button 
              onClick={fetchData}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Refresh Data
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SignalSourceCompare;
