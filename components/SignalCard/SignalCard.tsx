"use client";

import { useEffect, useState } from "react";
import RunningSignalCard from "./RunningSignalCard";
import LoaderCards from "../loaders/LoaderCards";
import FufilledSignalCard from "./FufilledSignalCard";
import supabase from "@/database/supabase/supabase";
import { notifyUser, soundNotification } from "@/lib/notification";

const SignalCard = ({ signalPassed, preferences }) => {
  const [signal, setSignal] = useState(signalPassed);
  const pref = preferences || {};

  // Adjust these keys as needed to match your preferences object
  const notifications =
    pref[signalPassed.instrument_name]?.notifications || false;
  const soundOn = pref[signalPassed.instrument_name]?.volume || false;

  useEffect(() => {
    const channel = supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "all_signals" },
        (payload) => {
          console.log("Change received!", payload);
          // Check if the updated row is the one we're displaying
          if (payload.new.id === signalPassed.id) {
            setSignal(payload.new);
            if (notifications) {
              notifyUser("Signal updated!");
            }
            // if (soundOn) {
            //   soundNotification();
            // }
          }
        },
      )
      .subscribe();

    // Cleanup the subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [signalPassed, notifications, soundOn]);

  if (!signal) {
    return <LoaderCards />;
  }

  const isBuy = signal.trade_side === "Long" ? true : false;

  if (signal.exit_price === null) {
    return <RunningSignalCard instrument={signal} isBuy={isBuy} />;
  }

  return <FufilledSignalCard instrument={signal} isBuy={isBuy} />;
};

export default SignalCard;
