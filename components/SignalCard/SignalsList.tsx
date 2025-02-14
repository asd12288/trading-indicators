"use client";

import supabaseClient from "@/database/supabase/supabase";
import { useEffect, useState } from "react";
import FavoriteSignals from "../FavoriteSignals";
import SignalCard from "./SignalCard";
import Link from "next/link";

const SignalsList = ({ latestSignals, favouriteSignals, preferences }) => {
  const [signals, setSignals] = useState(latestSignals);

  useEffect(() => {
    // 1) Set up a subscription to watch for changes in `all_signals` table.
    const channel = supabaseClient
      .channel("all-signals-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "all_signals" },
        (payload) => {
          console.log("Change received!", payload);

          // We have an updated or inserted row in `payload.new`.
          const updatedRow = payload.new;

          // 2) Update local state so the UI re-renders with new data.
          setSignals((current) => {
            // See if the updated row (by `id`) already exists
            const index = current.findIndex((s) => s.id === updatedRow.id);

            if (index === -1) {
              // If row doesn't exist, it was likely a new INSERT -> add it
              return [...current, updatedRow];
            } else {
              // If row already exists, replace that row with the updated row
              const newArr = [...current];
              newArr[index] = updatedRow;
              return newArr;
            }
          });
        },
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);
  return (
    <div className="mb-8 flex flex-col items-center space-y-6">
      {favouriteSignals.length > 0 && (
        <FavoriteSignals
          favouriteSignals={favouriteSignals}
          preferences={preferences}
        />
      )}
      <div className="grid grid-cols-3 gap-8">
        {signals.map((signal) => (
          <Link
            key={signal.client_trade_id}
            href={`/signals/${encodeURIComponent(signal.instrument_name)}`}
          >
            <SignalCard signalPassed={signal} preferences={preferences} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SignalsList;
