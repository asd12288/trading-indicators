"use client";

import useSignals from "@/hooks/useSignals";
import LoaderCards from "../loaders/LoaderCards";
import SignalCard from "./SignalCard";
import Link from "next/link";
import FavoriteSignals from "../FavoriteSignals";
import useProfile from "@/hooks/useProfile";

const SignalsList = ({ userId }) => {
  const { signals, isLoading } = useSignals();

  const { isLoading: isLoadingProfile, profile } = useProfile(userId);

  if (isLoadingProfile) {
    return <LoaderCards />;
  }

  const favoritePreferences = Object.entries(profile.preferences || {})
    .filter(([key, value]) => value.favorite)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  const favouriteInstruments = Object.keys(favoritePreferences);

  const favouriteSignals = signals.filter((signal) =>
    favouriteInstruments.includes(signal.instrument_name),
  );

  return (
    <div>
      {isLoading ? (
        <LoaderCards />
      ) : (
        <>
          {favouriteInstruments.length > 0 && (
            <FavoriteSignals
              favouriteSignals={favouriteSignals}
              preferences={profile.preferences}
            />
          )}

          <div className="grid grid-cols-3 gap-8">
            {signals.map((signal: any, index: number) => (
              <Link
                key={
                  signal.trade_client_id
                    ? `${signal.trade_client_id}-${signal.instrument_name}-${index}`
                    : `${signal.instrument_name}-${index}`
                }
                href={`/signals/${signal.instrument_name}`}
              >
                <SignalCard
                  signalPassed={signal}
                  preferences={profile.preferences}
                />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SignalsList;
