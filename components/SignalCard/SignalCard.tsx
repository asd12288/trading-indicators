"use client";

import { useEffect, useState } from "react";
import RunningSignalCard from "./RunningSignalCard";
import LoaderCards from "../loaders/LoaderCards";
import FufilledSignalCard from "./FufilledSignalCard";
import supabase from "@/database/supabase/supabase";
import { notifyUser, soundNotification } from "@/lib/notification";

const SignalCard = ({ signalPassed, prefrences }) => {
  const [signal, setSignal] = useState(null);

  const pref = prefrences || {};
  const notifications = pref[signalPassed]?.notifications || false;
  const soundOn = pref[signalPassed]?.volume || false;

  // 1. On mount: fetch the latest record from your table
  useEffect(() => {
    const fetchLatestSignal = async () => {
      const { data, error } = await supabase
        .from(signalPassed)
        .select("*")
        .order("entry_time", { ascending: false }) // or whichever column
        .limit(1);

      if (error) {
        console.error("Error fetching latest signal:", error);
        return;
      }

      if (data && data.length > 0) {
        setSignal(data[0]);
      }
    };

    fetchLatestSignal();

    // Card changes when a new signal is added
    const subscription = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: signalPassed },
        async (payload) => {
          const { data, error } = await supabase
            .from(signalPassed)
            .select("*")
            .order("entry_time", { ascending: false })
            .limit(1);

          if (error) {
            console.error("Error fetching latest signal:", error);
            return;
          }
          if (data && data.length > 0) {
            setSignal(data[0]);

            if (notifications) notifyUser(payload);
            if (soundOn) soundNotification(payload);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [signalPassed, notifications, soundOn]);

  // If we haven't fetched the initial row yet, render a loading placeholder
  if (!signal) {
    return <LoaderCards />;
  }

  const { exit_price, trade_side } = signal;
  const isBuy = trade_side === "Long";

  if (exit_price !== null) {
    return <FufilledSignalCard instrument={signal} isBuy={isBuy} />;
  } else {
    return <RunningSignalCard instrument={signal} isBuy={isBuy} />;
  }
};

export default SignalCard;
