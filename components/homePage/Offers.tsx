import React, { Suspense } from "react";
import supabase from "@/utils/supabase";
import { get } from "http";
import { getLatestByInstrument } from "@/app/lib/utils";
import SignalCard from "../SignalCard";
import LoaderCards from "../smallComponents/LoaderCards";

const Offers = async () => {
  const instrument = await getLatestByInstrument();

  const filterdInstruments = Object.values(instrument).filter((instrument) => {
    const { instrument: instrumentName } = instrument;
    return ["NASDAX", "DAX", "S&P500"].includes(instrumentName);
  });

  return (
    <section className="flex flex-col items-center md:mt-10">
      <h2 className="mb-4 text-center text-2xl font-semibold md:text-5xl">
        Live Trading Signals – Stay Ahead of the Market
      </h2>
      <h3 className="px-8 text-center text-sm md:mt-4 md:text-2xl">
        Our real-time trading signals provide you with expert-driven market
        insights, helping you make informed trading decisions quickly.{" "}
      </h3>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<LoaderCards />}>
          {filterdInstruments.map((ins) => (
            <SignalCard instrument={ins} key={ins.instrument} />
          ))}
        </Suspense>
      </div>
      <h4 className="mt-8 px-8 text-center text-2xl font-medium">
        With our real-time alerts, you’ll never miss a trading opportunity
        again!
      </h4>

      <div className="my-8 md:my-16"></div>
    </section>
  );
};

export default Offers;
