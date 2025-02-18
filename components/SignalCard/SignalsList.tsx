"use client";

import useSignals from "@/hooks/useSignals";
import LoaderCards from "../loaders/LoaderCards";
import SignalCard from "./SignalCard";
import Link from "next/link";
import FavoriteSignals from "../FavoriteSignals";
import usePreferences from "@/hooks/usePreferences";
import useProfile from "@/hooks/useProfile";

const SignalsList = ({ userId }: { userId: string }) => {
  const {
    preferences,
    isLoading: isLoadingPrefs,
    error,
    favorites,
  } = usePreferences(userId);

  const { isPro } = useProfile(userId);
  const { signals, isLoading: isLoadingSignals } = useSignals(preferences);

  if (isLoadingSignals || isLoadingPrefs) {
    return <LoaderCards />;
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  const favouriteSignals = signals.filter((signal) =>
    favorites.includes(signal.instrument_name),
  );

  // If not Pro, limit the signals to the first 5 items
  const limitedSignals = !isPro ? signals.slice(0, 5) : signals;

  return (
    <div className="rounded-lg bg-slate-800 p-8">
      {isPro && favouriteSignals.length > 0 && (
        <FavoriteSignals favouriteSignals={favouriteSignals} />
      )}

      {/* Non-pro users: show upgrade message and button */}
      {!isPro && (
        <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
          <p className="text-center text-gray-400">
            Upgrade to view all signals and add favorites.
          </p>
          <Link href="/profile?tab=upgrade">
            <button className="rounded-lg bg-green-800 p-2">Upgrade now</button>
          </Link>
        </div>
      )}

      <div className="md:grid-col-2 grid gap-8 rounded-lg bg-slate-800 p-8 lg:grid-cols-3">
        {limitedSignals.map((signal: any, index: number) => (
          <Link
            className="flex justify-center"
            key={`${signal.instrument_name}-${index}`}
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
