"use client";

import useSignals from "@/hooks/useSignals";
import LoaderCards from "../loaders/LoaderCards";
import SignalCard from "./SignalCard";
import Link from "next/link";
import FavoriteSignals from "../FavoriteSignals";

const SignalsList = ({ profile }) => {
  const { signals, isLoading } = useSignals();

  const favouriteInstruments = Object.entries(profile.preferences)
    .filter(([_, data]) => data.favorite === true)
    .map(([instrument]) => instrument);

  // Filter the signals based on favorite instruments
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
