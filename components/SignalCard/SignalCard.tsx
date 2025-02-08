"use client";

import { useEffect, useState } from "react";
import RunningSignalCard from "./RunningSignalCard";
import LoaderCards from "../loaders/LoaderCards";
import FufilledSignalCard from "./FufilledSignalCard";
import { toast } from "@/hooks/use-toast";
import supabase from "@/database/supabase/supabase";

const SignalCard = ({ signalPassed }) => {
  const [signal, setSignal] = useState(null);

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

    // 2. Set up subscription for changes:
    const subscription = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: signalPassed },
        (payload) => {
          if (payload.new) {
            setSignal(payload.new);

            // if the user enabled notifications, show a toast
            toast({
              title: `New signal ${payload?.new?.instrument_name}`,
              description: `${payload.new.exit_price === null ? `A new signal has Started added, Entry Price: ${payload.new.entry_price}` : `A signal has been closed with Exit Price: ${payload.new.exit_price}`}`,
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [signalPassed]);

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
