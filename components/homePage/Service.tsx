import React from "react";
import { HiBadgeCheck, HiBell, HiChartBar, HiUserGroup } from "react-icons/hi";

const Service = () => {
  return (
    <section className="mt-3 flex flex-col md:space-x-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="w-full lg:w-1/2">
        <h2 className="text-center text-3xl font-semibold md:text-5xl lg:pr-8 lg:text-left lg:text-6xl">
          Simple, Real Time, and optimal to work with
        </h2>
        <p className="mt-3 p-2 text-center text-lg font-light lg:pr-3 lg:text-left lg:text-xl">
          We choose the best intrumet on the market and made them
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 p-8 md:mt-4 md:grid-cols-2 lg:w-1/2">
        <div className="flex items-center justify-center gap-4 rounded-lg border-2 border-solid border-slate-500 p-5 md:p-8 lg:flex-col xl:flex-row">
          <div className="rounded-full bg-slate-500 p-2 text-5xl text-slate-50">
            <HiBell />
          </div>
          <div className="space-y-2">
            <h3 className="text-left text-lg font-medium lg:text-center xl:text-left">
              Real-Time Alerts
            </h3>
            <p className="text-left text-xs font-extralight lg:text-center xl:text-left">
              Get instant updates on market opportunities.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg border-2 border-solid border-slate-500 p-5 md:p-8 lg:flex-col xl:flex-row">
          <div className="rounded-full bg-slate-500 p-2 text-5xl text-slate-50">
            <HiChartBar />
          </div>
          <div className="space-y-2">
            {/* Fixed: "lg:text-x" -> "lg:text-xl", "text-leftl" -> "text-left", "text-sx" -> "text-xs" */}
            <h3 className="text-left text-lg font-medium lg:text-center xl:text-left">
              Expert Analysis
            </h3>
            <p className="text-left text-xs font-extralight lg:text-center lg:text-sm xl:text-left">
              Strategies based on technical and fundamental research.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg border-2 border-solid border-slate-500 p-5 md:p-8 lg:flex-col xl:flex-row">
          <div className="rounded-full bg-slate-500 p-2 text-5xl text-slate-50">
            <HiUserGroup />
          </div>
          <div className="space-y-2">
            <h3 className="text-left text-lg font-medium lg:text-center xl:text-left">
              User-Friendly
            </h3>
            <p className="text-left text-xs font-extralight lg:text-center xl:text-left">
              Easy-to-follow signals for all trading levels.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg border-2 border-solid border-slate-500 p-5 md:p-8 lg:flex-col xl:flex-row">
          <div className="rounded-full bg-slate-500 p-2 text-5xl text-slate-50">
            <HiBadgeCheck />
          </div>
          <div className="space-y-2">
            <h3 className="text-left text-lg font-medium lg:text-center xl:text-left">
              Multi-Asset Coverage
            </h3>
            <p className="text-left text-xs font-extralight lg:text-center xl:text-left">
              Forex, Crypto, Stocks, and more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Service;
