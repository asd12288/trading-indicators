import React from "react";
import Benefit from "./smallComponents/Benefit";
import Link from "next/link";

const PlanCard = () => {
  return (
    <div className="space-y-6 rounded-lg bg-slate-800 p-8">
      <h3 className="text-4xl font-medium">Premium Plan</h3>
      <div className="flex items-baseline gap-2">
        <h4 className="text-5xl font-semibold">65$</h4>
        <p>Per month</p>
      </div>
      <p className="text-sm text-gray-400">Billed monthly</p>
      <ul className="space-y-4">
        <Benefit benefit="Access to all signals" />
        <Benefit benefit="Analysis of all the instruments" />
        <Benefit benefit="Telegram notifications" />
        <Benefit benefit="Alerts on upcomming trades" />
        <Benefit benefit="Custom signals prefrences" />
      </ul>
      <Link href={"/signup"}>
        <button className="mt-4 w-full rounded-lg bg-green-800 px-2 py-2 hover:bg-green-900">
          Get started
        </button>
      </Link>
    </div>
  );
};

export default PlanCard;
