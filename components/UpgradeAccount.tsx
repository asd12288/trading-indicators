"use client";

import React, { useEffect, useState } from "react";
import Benefit from "./smallComponents/Benefit";
import Link from "next/link";
import { loadPaddle } from "@paddle/paddle-js";

const UpgradeAccount = () => {
  const [checkoutUrl, setCheckoutUrl] = useState("");

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     const Paddle = await loadPaddle()
  //   }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-center text-3xl font-semibold">
        Upgrade your account
      </h1>
      <p className="mt-4 text-center text-lg text-gray-500">
        Unlock more features and benefits by upgrading your account
      </p>

      <div className="w-128 j space-y-4 p-8">
        <h4 className="text-3xl font-semibold">Premium Plan</h4>

        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-semibold">65$</h4>
          <p className="text-sm">per month</p>
        </div>

        <p className="text-sm text-gray-400">Billed monthly</p>
        <ul className="space-y-2 text-sm">
          <Benefit benefit="Access to all signals" />
          <Benefit benefit="Analysis of all the instruments" />
          <Benefit benefit="Telegram notifications" />
          <Benefit benefit="Alerts on upcomming trades" />
          <Benefit benefit="Custom signals prefrences" />
        </ul>
        <Link href="checkout/pri_01jkxw8zjnvbkr2ehd3h900z8f">
          <button className="mt-2 w-80 rounded-lg bg-green-800 px-2 py-2">
            Upgrade my account
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UpgradeAccount;
