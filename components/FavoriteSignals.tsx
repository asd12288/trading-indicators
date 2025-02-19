import React from "react";
import SignalCard from "./SignalCard/SignalCard";
import Link from "next/link";

const FavoriteSignals = ({ favouriteSignals }) => {
  return (
    <>
      <h2 className="my-4 text-center text-2xl font-medium">My Signals</h2>
      <div className={`md:grid md:grid-cols-3 flex flex-col justify-center gap-8`}>
        {favouriteSignals.map((signal) => (
          <Link
            key={signal.client_trade_id}
            href={`/signals/${encodeURIComponent(signal.instrument_name)}`}
            className="justify-center flex "
          >
            <SignalCard signalPassed={signal}  />
          </Link>
        ))}
      </div>
      <div className="my-8 w-full border-2 border-slate-400"></div>
    </>
  );
};

export default FavoriteSignals;
