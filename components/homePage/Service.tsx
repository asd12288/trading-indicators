"use client";

import React, { lazy, Suspense, useEffect } from "react";
import { useTranslations } from "next-intl";
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
      <div className="relative h-full overflow-hidden rounded-xl border border-slate-700/30 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-700/10">
        {/* Add subtle gradient glow effect in the background - lighter */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-800/10 to-cyan-800/10 blur-2xl"></div>
        <div className="absolute -bottom-5 -left-5 h-20 w-20 rounded-full bg-gradient-to-br from-indigo-800/10 to-purple-800/10 blur-xl"></div>

        <div className="relative z-10 flex h-full flex-col items-center gap-4 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 p-4 backdrop-blur-sm transition-all md:p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700/40 to-teal-800/40 text-3xl text-slate-50 shadow-lg md:text-4xl">
            <Icon aria-hidden="true" />
          </div>
          <div className="space-y-2 text-center md:space-y-3">
            <h3 className="text-lg font-semibold text-slate-100 md:text-xl">
              {t(`features.${titleKey}.title`)}
            </h3>
            <p className="text-xs text-slate-300 md:text-sm">
              {t(`features.${titleKey}.description`)}
            </p>
          </div>
        </div>
      </div>
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
      className="relative px-4 py-16 md:py-24"
    >
      {/* Section divider - creates visual connection between sections - darker */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800/60 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-gradient-to-r from-emerald-900/20 to-teal-900/20 px-4 py-1.5 text-sm font-medium text-emerald-500">
            {t("subtitle")}
          </span>
          <h2
            id="services-heading"
            className="mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl"
          >
            {t("title")}
          </h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-emerald-700/50"></div>
        </motion.div>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
          {features.map((feature, index) => (
            <Suspense
              key={feature.key}
              fallback={
                <div className="h-40 animate-pulse rounded-lg bg-slate-800 md:h-64"></div>
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
      </div>
    </section>
  );
};

export default React.memo(Service);
