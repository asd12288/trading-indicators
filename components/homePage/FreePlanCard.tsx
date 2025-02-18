import React from "react";
import Benefit from "../smallComponents/Benefit";
import Link from "next/link";

const FreePlanCard = () => {
  return (
    <div className="space-y9 space-y-8 rounded-lg bg-slate-900 p-8">
      <h3 className="text-4xl font-medium">Free Plan</h3>

      <ul className="space-y-4">
        <Benefit benefit="Access 5 Signals" />
        <Benefit benefit="Analysis of the instruments" />
        <Benefit benefit="Alerts on upcomming trades" />
      </ul>
      <Link href={"/signup"}>
        <button className="mt-4 w-full rounded-lg bg-green-800 px-2 py-2 hover:bg-green-900">
          Get started for free
        </button>
      </Link>
    </div>
  );
};

export default FreePlanCard;
