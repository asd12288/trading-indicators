"use client";

import React, { lazy, Suspense } from "react";
import { useTranslations } from "next-intl";
import { BackgroundGradient } from "../ui/background-gradient";

// Import icons dynamically to reduce bundle size
import dynamic from "next/dynamic";

const HiBell = dynamic(
  () => import("react-icons/hi").then((mod) => mod.HiBell),
  { ssr: false },
);
const HiChartBar = dynamic(
  () => import("react-icons/hi").then((mod) => mod.HiChartBar),
  { ssr: false },
);
const HiUserGroup = dynamic(
  () => import("react-icons/hi").then((mod) => mod.HiUserGroup),
  { ssr: false },
);
const HiBadgeCheck = dynamic(
  () => import("react-icons/hi").then((mod) => mod.HiBadgeCheck),
  { ssr: false },
);

// Feature component to reduce DOM size
const FeatureCard = ({ icon: Icon, titleKey, descKey, t }) => (
  <BackgroundGradient>
    <div className="flex flex-col items-center gap-4 p-6 md:p-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-600 text-4xl text-slate-50 shadow-md">
        <Icon />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold text-slate-200">
          {t(`features.${titleKey}.title`)}
        </h3>
        <p className="text-sm text-slate-400">
          {t(`features.${titleKey}.description`)}
        </p>
      </div>
    </div>
  </BackgroundGradient>
);

const Service = () => {
  const t = useTranslations("HomePage.service");

  const features = [
    { icon: HiBell, key: "alerts" },
    { icon: HiChartBar, key: "analysis" },
    { icon: HiUserGroup, key: "userFriendly" },
    { icon: HiBadgeCheck, key: "multiAsset" },
  ];

  return (
    <section className="mt-16 flex flex-col items-center space-y-10 lg:space-y-12">
      <div className="max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-200">
          {t("title")}
        </h2>
        <p className="mt-3 text-lg text-slate-400">{t("subtitle")}</p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
        {features.map((feature) => (
          <Suspense
            key={feature.key}
            fallback={
              <div className="h-48 animate-pulse rounded-lg bg-slate-800"></div>
            }
          >
            <FeatureCard
              icon={feature.icon}
              titleKey={feature.key}
              descKey={feature.key}
              t={t}
            />
          </Suspense>
        ))}
      </div>
    </section>
  );
};

export default Service;
