import { auth } from "@/auth";
import SignalCard from "@/components/SignalCard";
import supabase from "@/utils/supabase";
import Link from "next/link";
import React from "react";
import { getLatestByInstrument } from "../lib/utils";

async function page() {
  const session = await auth();

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

  const { filtered: filterdInstrument } = await getLatestByInstrument();

  if (!session?.user?.name) {
    return (
      <>
        <div className="flex flex-col items-center space-y-6">
          <h2 className="mt-8 border-b-2 text-5xl font-bold">
            Latest Signals per Instrument
          </h2>
          <Link href="/login">
            <p>
              New to the platform?{" "}
              <span className="hover:underline">check our guide</span> for
              better understanding
            </p>
          </Link>
          <div className="grid grid-cols-3 gap-4">
            {filterdInstrument.map((row) => (
              <SignalCard key={row.instrument} instrument={row} />
            ))}
          </div>
          <p>10 more instrument for Premium account</p>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="mt-8 border-b-2 text-5xl font-bold">
        Latest Signals per Instrument
      </h2>
      <Link href="/login">
        <p>
          New to the platform?{" "}
          <span className="hover:underline">check our guide</span> for better
          understanding
        </p>
      </Link>
      <div className="grid grid-cols-3 gap-4">
        {uniqueInstruments.map((row) => (
          <SignalCard key={row.instrument} instrument={row} />
        ))}
      </div>
    </div>
  );
}

export default page;
