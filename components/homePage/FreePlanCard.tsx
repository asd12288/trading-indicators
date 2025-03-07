'use client'

import React from "react";
import { useTranslations } from "next-intl";
import { BackgroundGradient } from "../ui/background-gradient";
import { Link } from "@/i18n/routing";
import Benefit from "../smallComponents/Benefit";

const FreePlanCard = () => {
  const t = useTranslations("HomePage.freePlanCard");

  return (
    <BackgroundGradient className="relative overflow-hidden rounded-xl p-8 shadow-lg">
      {/* Floating Label */}
      <div className="absolute right-3 top-3 rounded-full bg-slate-700 px-3 py-1 text-xs font-medium text-slate-300">
        Free Plan
      </div>

      <h3 className="text-4xl font-bold text-green-400">{t("plan")}</h3>

      <p className="mt-2 text-sm text-slate-400">Perfect for beginners</p>

      <ul className="mt-6 space-y-4">
        <li>
          <Benefit benefit={t("benefit1")} />
        </li>
        <li>
          <Benefit benefit={t("benefit2")} />
        </li>
        <li>
          <Benefit benefit={t("benefit3")} />
        </li>
      </ul>

      <Link href={"/signup"}>
        <button className="mt-6 w-full rounded-lg bg-gradient-to-r from-green-600 to-green-800 px-6 py-3 text-lg font-medium text-white shadow-md transition hover:scale-105">
          {t("button")}
        </button>
      </Link>
    </BackgroundGradient>
  );
};

export default FreePlanCard;
