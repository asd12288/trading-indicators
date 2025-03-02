"use client";

import React from "react";
import { HiBadgeCheck, HiBell, HiChartBar, HiUserGroup } from "react-icons/hi";
import { useTranslations } from "next-intl";
import { BackgroundGradient } from "../ui/background-gradient";

const Service = () => {
  const t = useTranslations("HomePage.service");

  return (
    <section className="mt-16 flex flex-col items-center space-y-10 lg:space-y-12">
      {/* Section Title */}
      <div className="text-center max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-slate-200">
          {t("title")}
        </h2>
        <p className="mt-3 text-lg text-slate-400">{t("subtitle")}</p>
      </div>

      {/* Features Grid */}
      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
        {/* Alerts */}
        <BackgroundGradient>
          <div className="flex flex-col items-center gap-4 p-6 md:p-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-600 text-slate-50 text-4xl shadow-md">
              <HiBell />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-slate-200">
                {t("features.alerts.title")}
              </h3>
              <p className="text-sm text-slate-400">
                {t("features.alerts.description")}
              </p>
            </div>
          </div>
        </BackgroundGradient>

        {/* Analysis */}
        <BackgroundGradient>
          <div className="flex flex-col items-center gap-4 p-6 md:p-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-600 text-slate-50 text-4xl shadow-md">
              <HiChartBar />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-slate-200">
                {t("features.analysis.title")}
              </h3>
              <p className="text-sm text-slate-400">
                {t("features.analysis.description")}
              </p>
            </div>
          </div>
        </BackgroundGradient>

        {/* User-Friendly */}
        <BackgroundGradient>
          <div className="flex flex-col items-center gap-4 p-6 md:p-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-600 text-slate-50 text-4xl shadow-md">
              <HiUserGroup />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-slate-200">
                {t("features.userFriendly.title")}
              </h3>
              <p className="text-sm text-slate-400">
                {t("features.userFriendly.description")}
              </p>
            </div>
          </div>
        </BackgroundGradient>

        {/* Multi-Asset */}
        <BackgroundGradient>
          <div className="flex flex-col items-center gap-4 p-6 md:p-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-600 text-slate-50 text-4xl shadow-md">
              <HiBadgeCheck />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-slate-200">
                {t("features.multiAsset.title")}
              </h3>
              <p className="text-sm text-slate-400">
                {t("features.multiAsset.description")}
              </p>
            </div>
          </div>
        </BackgroundGradient>
      </div>
    </section>
  );
};

export default Service;
