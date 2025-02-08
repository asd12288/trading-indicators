"use client";

import React, { useEffect, useState } from "react";
import SignalTableRow from "./SignalTableRow";
import TableSignalsLoader from "./loaders/TableSignalsLoader";
import supabase from "@/database/supabase/supabase";

const SignalTable = ({ signalPassed }) => {
  const [signals, setSignals] = useState(null);

  useEffect(() => {
    const fetchLatestSignals = async () => {
      const threeDaysAgo = new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const { data, error } = await supabase
        .from(signalPassed)
        .select("*")
        .gte("entry_time", threeDaysAgo)
        .order("entry_time", { ascending: false });

      if (error) {
        console.error("Error fetching signals from last 3 days:", error);
        return null;
      }

      if (data && data.length > 0) {
        setSignals(data);
      }
    };
    fetchLatestSignals();
  }, [signalPassed]);

  if (!signals) {
    return <TableSignalsLoader />;
  }

  return (
    <div className="relative h-[28rem] overflow-y-auto rounded-sm text-slate-100">
      <table className="w-full table-auto p-4 text-left text-sm">
        <thead className="text-sx sticky top-0 h-16 bg-slate-700 uppercase">
          <tr>
            <th scope="col" className="px-6 py-3">
              Long/Short
            </th>
            <th scope="col" className="px-6 py-3">
              Entry Price
            </th>
            <th scope="col" className="px-6 py-3">
              Exit Price
            </th>
            <th scope="col" className="px-6 py-3">
              Result in Ticks
            </th>
            <th scope="col" className="px-6 py-3">
              Trade Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {signals?.map((signal) => (
            <SignalTableRow key={signal.client_trade_id} signal={signal} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SignalTable;
