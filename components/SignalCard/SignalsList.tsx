"use client";

import useSignals from "@/hooks/useSignals";
import LoaderCards from "../loaders/LoaderCards";
import SignalCard from "./SignalCard";
import Link from "next/link";
import FavoriteSignals from "../FavoriteSignals";
import usePreferences from "@/hooks/usePreferences";

const SignalsList = ({ userId }) => {
  // Get preferences directly from usePreferences
  const {
    preferences,
    isLoading: isLoadingPrefs,
    error,
  } = usePreferences(userId);

  // Use your signals hook
  const { signals, isLoading: isLoadingSignals } = useSignals(preferences);

  if (isLoadingSignals || isLoadingPrefs) {
    return <LoaderCards />;
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  // Filter favorites
  const favoriteInstruments = Object.entries(preferences)
    .filter(([_, val]) => val?.favorite)
    .map(([instrument]) => instrument);

  const favouriteSignals = signals.filter((signal) =>
    favoriteInstruments.includes(signal.instrument_name),
  );

  return (
    <div className="rounded-lg bg-slate-800 p-8">
      {favouriteSignals.length > 0 && (
        <FavoriteSignals favouriteSignals={favouriteSignals} />
      )}

      <div className="grid grid-cols-3 gap-8 rounded-lg bg-slate-800 p-8">
        {signals.map((signal: any) => (
          <Link
            key={signal.instrument_name}
            href={`/signals/${signal.instrument_name}`}
          >
            <SignalCard signalPassed={signal} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SignalsList;
