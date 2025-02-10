"use client";

import React from "react";
import Benefit from "../smallComponents/Benefit";
import Link from "next/link";

const PlanCard = ({ title, price, benefits, icon, size = "regular" }) => {
  if (size === "small") {
    return (
      <div className="w-52 mx-6">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl">{icon}</h3>
          <h3 className="text-xl font-medium">{title}</h3>
        </div>
        <div className="mt-2 flex items-center gap-4">
          <p className="mt-2 text-2xl font-semibold">{price}$</p>
          <p className="w-48 rounded-full bg-green-200 px-2 py-1 text-center text-sm text-green-950">
            20% discount
          </p>
        </div>

        <div className="text-sm mt-2 space-y-2">
          {Object.values(benefits).map((benefit, index) => (
            <Benefit benefit={benefit} key={index}  />
          ))}
        </div>
        <Link href="/payment">
          <button className="mt-4 w-full bg-green-800 hover:bg-green-900 px-4 py-2 text-sm rounded-xl">Upgrade to pro account</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="ease flex w-96 flex-col items-start space-y-5 rounded-lg bg-slate-800 p-6">
      <h3 className="text-6xl">{icon}</h3>
      <h3 className="mt-3 text-3xl font-medium">{title}</h3>

      <div className="mt-3 flex items-center gap-6">
        <p className="text-4xl font-semibold">{price}$</p>
        <p className="rounded-full bg-green-200 px-2 py-1 text-sm text-green-950">
          20% discount
        </p>
      </div>
      <Link href="/signup" className="w-full">
        <button className="mt-4 w-full rounded-full bg-green-600 p-3 text-lg text-green-50 transition-all hover:bg-green-700">
          Upgrade to pro account
        </button>
      </Link>

      <div className="mt-4 space-y-4">
        {Object.values(benefits).map((benefit, index) => (
          <Benefit benefit={benefit} key={index} />
        ))}
      </div>
    </div>
  );
};

export default PlanCard;
