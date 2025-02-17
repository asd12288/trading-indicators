import React from "react";
import SignalCard from "./SignalCard/SignalCard";
import Link from "next/link";

const FavoriteSignals = ({ favouriteSignals, preferences }) => {
  return (
    <>
      <h2 className="my-4 text-center text-2xl font-medium">My Signals</h2>
      <div className={`grid grid-cols-3 gap-8`}>
        {favouriteSignals.map((signal) => (
          <Link
            key={signal.client_trade_id}
            href={`/signals/${encodeURIComponent(signal.instrument_name)}`}
          >
            <SignalCard signalPassed={signal} preferences={preferences} />
          </Link>
        ))}
      </div>
      <div className="my-8 w-full border-2 border-slate-400"></div>
    </>
  );
};

export default FavoriteSignals;
