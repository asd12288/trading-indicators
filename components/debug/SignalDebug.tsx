import React from 'react';

const SignalDebug = ({ signals }) => {
  const runningSignals = signals.filter(s => s.exit_price === null);
  
  return (
    <div className="p-4 bg-slate-800 rounded-md">
      <h3 className="text-xl font-medium text-white mb-2">Signal Debug</h3>
      <div className="text-slate-300">
        <p>Total signals: {signals.length}</p>
        <p>Running signals: {runningSignals.length}</p>
        {runningSignals.length > 0 && (
          <div className="mt-2">
            <p className="text-green-400">Running signal IDs:</p>
            <ul className="list-disc pl-5">
              {runningSignals.map(s => (
                <li key={s.client_trade_id || s.instrument_name}>
                  {s.instrument_name} (Entry: {s.entry_time})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalDebug;
