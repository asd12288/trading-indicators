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
    <div className={`grid ${cols} gap-8`}>
      {favouriteSignals.map((signal) => (
        <Link
          key={signal.id}
          href={`/signals/${encodeURIComponent(signal.instrument_name)}`}
        >
          <SignalCard signalPassed={signal} preferences={preferences} />
        </Link>
      ))}
    </div>
  );
};

export default FavoriteSignals;
