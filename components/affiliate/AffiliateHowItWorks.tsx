"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { UserPlus, Link, BarChart, CreditCard } from "lucide-react";

const AffiliateHowItWorks = () => {
  const t = useTranslations("AffiliatePage");

  const steps = [
    {
      icon: <UserPlus className="h-10 w-10 text-blue-400" />,
      titleKey: "signup",
      descriptionKey: "signupDescription",
    },
    {
      icon: <Link className="h-10 w-10 text-indigo-400" />,
      titleKey: "promote",
      descriptionKey: "promoteDescription",
    },
    {
      icon: <BarChart className="h-10 w-10 text-purple-400" />,
      titleKey: "track",
      descriptionKey: "trackDescription",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-emerald-400" />,
      titleKey: "earn",
      descriptionKey: "earnDescription",
    },
  ];

  return (
    <div className="bg-slate-950 py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white">
            {t("howItWorks.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-300">
            {t("howItWorks.subtitle")}
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-5xl">
          {/* Connect the dots line */}
          <div className="absolute left-[10%] right-[10%] top-24 hidden h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 md:block"></div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index + 0.2 }}
                className="relative z-10 flex flex-col items-center rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 text-center backdrop-blur-sm"
              >
                <div className="relative mb-4 rounded-full border border-slate-700 bg-slate-900 p-4">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20"></div>
                  {step.icon}
                  <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">
                  {t(`howItWorks.steps.${step.titleKey}`)}
                </h3>
                <p className="text-slate-300">
                  {t(`howItWorks.steps.${step.descriptionKey}`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mx-auto mt-12 max-w-lg text-center italic text-slate-400"
        >
          {t("howItWorks.note")}
        </motion.p>
      </div>
    </div>
  );
};

export default AffiliateHowItWorks;
