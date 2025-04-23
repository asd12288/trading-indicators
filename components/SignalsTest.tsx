"use client";

import React from "react";
import useSignals from "@/hooks/useSignals";

interface SignalsTestProps {
  /** Pass true if you want every signal, not just the latest per instrument */
  allSignals?: boolean;
}

const SignalsTest: React.FC<SignalsTestProps> = ({ allSignals = false }) => {
  const { signals, isLoading, error, refetch } = useSignals(allSignals);

  if (isLoading) {
    return <div className="p-8 text-center">Loading…</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Failed to load signals: {error}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-4">
      <button
        onClick={refetch}
        className="mb-4 rounded bg-sky-600 px-4 py-2 text-white shadow hover:bg-sky-700"
      >
        Manual Refresh
      </button>

      {signals.length === 0 && (
        <p className="text-gray-500">No signals yet.</p>
      )}

      {signals.map((signal) => (
        <div
          key={signal.client_trade_id}
          className="rounded-lg border p-4 shadow"
        >
          <h3 className="font-semibold">{signal.instrument_name}</h3>
          <p>Trade Side: {signal.trade_side}</p>
          <p>
            Entry Time: {new Date(signal.entry_time).toLocaleString("en-GB")}
          </p>
          <p>Entry Price: {signal.entry_price}</p>
          <p>Exit&nbsp;Price: {signal.exit_price ?? "—"}</p>
        </div>
      ))}
    </div>
  );
};

export default SignalsTest;
