import React from "react";
import { HiBadgeCheck, HiBell, HiChartBar, HiUserGroup } from "react-icons/hi";
import { useTranslations } from "next-intl";

const Service = () => {
  const t = useTranslations("HomePage.service");

  return (
    <section className="mt-3 flex flex-col md:space-x-4 lg:items-center lg:justify-between">
      <div className="w-full lg:w-1/2">
        <h2 className="section-title">
          {t("title")}
        </h2>
        <p className="mt-3 p-2 text-center text-lg font-light lg:pr-3 lg:text-xl">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 p-8 md:mt-4 md:grid-cols-2 lg:w-1/2">
        <div className="flex items-center justify-center gap-4 rounded-lg border-2 border-solid border-slate-500 p-5 md:p-8 lg:flex-col xl:flex-row">
          <div className="rounded-full bg-slate-500 p-2 text-5xl text-slate-50">
            <HiBell />
          </div>
          <div className="space-y-2">
            <h3 className="text-left text-lg font-medium lg:text-center xl:text-left">
              {t("features.alerts.title")}
            </h3>
            <p className="text-left text-xs font-extralight lg:text-center xl:text-left">
              {t("features.alerts.description")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg border-2 border-solid border-slate-500 p-5 md:p-8 lg:flex-col xl:flex-row">
          <div className="rounded-full bg-slate-500 p-2 text-5xl text-slate-50">
            <HiChartBar />
          </div>
          <div className="space-y-2">
            <h3 className="text-left text-lg font-medium lg:text-center xl:text-left">
              {t("features.analysis.title")}
            </h3>
            <p className="text-left text-xs font-extralight lg:text-center lg:text-sm xl:text-left">
              {t("features.analysis.description")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg border-2 border-solid border-slate-500 p-5 md:p-8 lg:flex-col xl:flex-row">
          <div className="rounded-full bg-slate-500 p-2 text-5xl text-slate-50">
            <HiUserGroup />
          </div>
          <div className="space-y-2">
            <h3 className="text-left text-lg font-medium lg:text-center xl:text-left">
              {t("features.userFriendly.title")}
            </h3>
            <p className="text-left text-xs font-extralight lg:text-center xl:text-left">
              {t("features.userFriendly.description")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg border-2 border-solid border-slate-500 p-5 md:p-8 lg:flex-col xl:flex-row">
          <div className="rounded-full bg-slate-500 p-2 text-5xl text-slate-50">
            <HiBadgeCheck />
          </div>
          <div className="space-y-2">
            <h3 className="text-left text-lg font-medium lg:text-center xl:text-left">
              {t("features.multiAsset.title")}
            </h3>
            <p className="text-left text-xs font-extralight lg:text-center xl:text-left">
              {t("features.multiAsset.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Service;
