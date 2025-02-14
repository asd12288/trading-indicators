import React from "react";
import SignalCard from "./SignalCard/SignalCard";
import Link from "next/link";

const FavoriteSignals = ({ favouriteSignals, preferences }) => {
  const cols =
    favouriteSignals.length === 1
      ? "grid-cols-1"
      : favouriteSignals.length === 2
        ? "md:grid-cols-2 grid-cols-1"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <h2 className="mt-4 text-2xl font-medium">My Signals</h2>
      <div className={`grid ${cols} gap-8`}>
        {favouriteSignals.map((signal) => (
          <Link
            key={signal.id}
            href={`/signals/${encodeURIComponent(signal.instrument_name)}`}
          >
            <SignalCard signalPassed={signal} preferences={preferences} key={signal.id} />
          </Link>
        ))}
      </div>
      <div className="mb-2 w-full border-2 border-slate-400"></div>
    </>
  );
};

export default FavoriteSignals;
