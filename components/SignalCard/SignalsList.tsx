"use client";

import useSignals from "@/hooks/useSignals";
import LoaderCards from "../loaders/LoaderCards";
import SignalCard from "./SignalCard";
import Link from "next/link";
import FavoriteSignals from "../FavoriteSignals";
import useProfile from "@/hooks/useProfile";

const SignalsList = ({ userId }) => {
  const { isLoading: isLoadingProfile, profile } = useProfile(userId);
  // Ensure a default object so we're not passing undefined
  const preferences = profile?.preferences || {};

  // Pass preferences into the hook
  const { signals, isLoading } = useSignals(preferences);

  if (isLoading || isLoadingProfile) {
    return <LoaderCards />;
  }

  // Filter favorites for example
  const favoritePreferences = Object.entries(preferences)
    .filter(([_, value]) => value?.favorite)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  const favouriteInstruments = Object.keys(favoritePreferences);
  const favouriteSignals = signals.filter((signal) =>
    favouriteInstruments.includes(signal.instrument_name)
  );

  return (
    <div>
      {favouriteInstruments.length > 0 && (
        <FavoriteSignals
          favouriteSignals={favouriteSignals}
          preferences={preferences}
        />
      )}

      <div className="grid grid-cols-3 gap-8">
        {signals.map((signal: any, index: number) => (
          <Link
            key={`${signal.instrument_name}-${index}`}
            href={`/signals/${signal.instrument_name}`}
          >
            <SignalCard signalPassed={signal} preferences={preferences} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SignalsList;
