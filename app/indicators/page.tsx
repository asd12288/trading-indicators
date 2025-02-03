import SignalCard from "@/components/SignalCard";
import supabase from "@/utils/supabase";
import React from "react";

async function page() {
  const { data: rows, error } = await supabase
    .from("indicators_order_start")
    .select("*");

  if (error || !rows) return <p>Error loading signals</p>;

  const latestByInstrument = rows.reduce(
    (acc, row) => {
      const current = acc[row.instrument];
      if (
        !current ||
        new Date(row.orderTime).getTime() >
          new Date(current.orderTime).getTime()
      ) {
        acc[row.instrument] = row;
      }
      return acc;
    },
    {} as { [key: string]: { instrument: string; orderTime: string } },
  );

  // Convert the grouped object to an array of unique instruments
  const uniqueInstruments = Object.values(latestByInstrument);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Latest Signals per Instrument</h2>
      <div className="grid grid-cols-3 grid-rows-3 gap-4">
        {uniqueInstruments.map((row) => (
          <SignalCard key={row.instrument} instrument={row} />
        ))}
      </div>
    </div>
  );
}

export default page;
