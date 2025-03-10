'use client'

import React from 'react';
import useSignals from '@/hooks/useSignals';

const SignalDebugDisplay = () => {
  const { signals, isLoading, error } = useSignals();
  
  const runningSignals = signals.filter(s => s.exit_price === null);
  const completedSignals = signals.filter(s => s.exit_price !== null);
  
  return (
    <div className="p-4 bg-slate-800/80 rounded-lg border border-slate-700 shadow-lg">
      <h3 className="text-xl font-medium text-white mb-4">Signal Debug Panel</h3>
      
      {isLoading ? (
        <div className="text-slate-300">Loading signals...</div>
      ) : error ? (
        <div className="text-red-400">Error: {error}</div>
      ) : (
        <div className="text-slate-300">
          <div className="mb-3">
            <span className="font-medium">Total signals:</span> {signals.length}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-green-400 font-medium">Running Signals</h4>
                <span className="bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full text-xs font-medium">
                  {runningSignals.length}
                </span>
              </div>
              
              {runningSignals.length === 0 ? (
                <p className="text-slate-400 text-sm">No running signals found</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1 text-sm max-h-40 overflow-y-auto">
                  {runningSignals.map(s => (
                    <li key={s.client_trade_id} className="text-slate-300">
                      <span className="font-medium">{s.instrument_name}</span> 
                      <span className="text-slate-400 text-xs ml-2">
                        ({new Date(s.entry_time).toLocaleString()})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="bg-slate-700/50 rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-blue-400 font-medium">Completed Signals</h4>
                <span className="bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium">
                  {completedSignals.length}
                </span>
              </div>
              
              {completedSignals.length === 0 ? (
                <p className="text-slate-400 text-sm">No completed signals found</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1 text-sm max-h-40 overflow-y-auto">
                  {completedSignals.map(s => (
                    <li key={s.client_trade_id} className="text-slate-300">
                      <span className="font-medium">{s.instrument_name}</span> 
                      <span className="text-slate-400 text-xs ml-2">
                        (Exit: {new Date(s.exit_time).toLocaleString()})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-slate-200 font-medium mb-2">Signal Update Log</h4>
            <div className="bg-slate-900 rounded-md p-2 h-32 overflow-y-auto text-xs font-mono">
              <pre className="text-slate-400">
                Listening for real-time updates...
                (Check your browser console for detailed logs)
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignalDebugDisplay;
