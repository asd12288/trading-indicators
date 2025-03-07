"use client";

import React, { lazy, Suspense, useEffect } from "react";
import { useTranslations } from "next-intl";
import { BackgroundGradient } from "../ui/background-gradient";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
const FeatureCard = ({ icon: Icon, titleKey, descKey, t, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: index * 0.1 },
      });
    }
  }, [controls, inView, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      className="h-full"
    >
      <BackgroundGradient className="h-full">
        <div className="flex h-full flex-col items-center gap-4 rounded-xl border border-slate-700/30 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-4xl text-slate-50 shadow-lg">
            <Icon aria-hidden="true" />
          </div>
          <div className="space-y-3 text-center">
            <h3 className="text-xl font-semibold text-slate-100">
              {t(`features.${titleKey}.title`)}
            </h3>
            <p className="text-sm text-slate-300">
              {t(`features.${titleKey}.description`)}
            </p>
          </div>
        </div>
      </BackgroundGradient>
    </motion.div>
  );
};

const Service = () => {
  const t = useTranslations("HomePage.service");

  const features = [
    { icon: HiBell, key: "alerts" },
    { icon: HiChartBar, key: "analysis" },
    { icon: HiUserGroup, key: "userFriendly" },
    { icon: HiBadgeCheck, key: "multiAsset" },
  ];

  return (
    <section
      aria-labelledby="services-heading"
      className="rounded-xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-800/80 px-4 py-16"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mx-auto mb-12 max-w-2xl text-center"
      >
        <span className="mb-3 inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-medium text-indigo-300">
          {t("subtitle")}
        </span>
        <h2
          id="services-heading"
          className="mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl lg:text-5xl"
        >
          {t("title")}
        </h2>
        <div className="mx-auto h-1 w-16 rounded-full bg-indigo-500/50"></div>
      </motion.div>

      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
        {features.map((feature, index) => (
          <Suspense
            key={feature.key}
            fallback={
              <div className="h-64 animate-pulse rounded-lg bg-slate-800"></div>
            }
          >
            <FeatureCard
              icon={feature.icon}
              titleKey={feature.key}
              descKey={feature.key}
              t={t}
              index={index}
            />
          </Suspense>
        ))}
      </div>
    </section>
  );
};

export default React.memo(Service);
