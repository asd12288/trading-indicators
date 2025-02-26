"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Benefit from "./smallComponents/Benefit";
import { Link } from "@/i18n/routing";
import PaypalSubscribeButton from "./PaypalButton";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const UpgradeAccount = ({ user }) => {
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const t = useTranslations("UpgradeAccount");
  const params = useParams();
  const locale = params.locale || "en";

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     const Paddle = await loadPaddle()
  //   }

  const benefits = [
    t("benefits.signals"),
    t("benefits.analysis"),
    t("benefits.telegram"),
    t("benefits.alerts"),
    t("benefits.preferences"),
  ];

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        intent: "subscription",
        vault: true,
      }}
    >
      <div className="flex md:items-center flex-col md:flex-row justify-center">
        <div className="flex flex-col justify-center">
          <div className="">
            <h1 className="text-3xl font-semibold">{t("title")}</h1>
            <p className="mt-4 text w-2/3 text-gray-500">{t("subtitle")}</p>
          </div>

          <div className="w-128 j space-y-4 p-8">
            <h4 className="text-3xl font-semibold">{t("plan.name")}</h4>

            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-semibold">{t("plan.price")}</h4>
              <p className="text-sm">{t("plan.period")}</p>
            </div>

            <p className="text-sm text-gray-400">{t("plan.billing")}</p>
            <ul className="space-y-2 text-sm">
              {benefits.map((benefit, index) => (
                <Benefit key={index} benefit={benefit} />
              ))}
            </ul>
              {/* <button className="mt-4 w-80 rounded-lg bg-green-800 px-2 py-2">
            {t("upgradeButton")}
          </button> */}
          </div>
        </div>
        <div className="p-4 text-slate-100">
          <PaypalSubscribeButton user={user} />
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default UpgradeAccount;
