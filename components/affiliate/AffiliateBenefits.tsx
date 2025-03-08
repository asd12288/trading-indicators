"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const AffiliateBenefits = () => {
  const t = useTranslations("AffiliatePage");

  const benefits = [
    "recurrentCommissions",
    "highConversion",
    "dedicatedSupport",
    "marketingMaterials",
    "detailedReporting",
    "competitiveRates",
    "quickPayouts",
    "exclusivePromos",
  ];

  return (
    <div className="bg-slate-900 py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white">
            {t("benefits.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-300">
            {t("benefits.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto grid max-w-6xl grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="flex items-start"
            >
              <CheckCircle className="mr-3 mt-1 h-6 w-6 flex-shrink-0 text-emerald-500" />
              <div>
                <h3 className="mb-1 text-lg font-semibold text-white">
                  {t(`benefits.items.${benefit}.title`)}
                </h3>
                <p className="text-slate-300">
                  {t(`benefits.items.${benefit}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mx-auto mt-16 max-w-5xl rounded-xl border border-blue-700/30 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-8"
        >
          <h3 className="mb-4 text-center text-2xl font-bold text-white">
            {t("benefits.commission.title")}
          </h3>
          <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
            <div className="rounded-lg bg-slate-800/70 p-6">
              <div className="mb-2 text-3xl font-bold text-blue-400">20%</div>
              <p className="text-slate-300">
                {t("benefits.commission.standard")}
              </p>
            </div>
            <div className="relative transform rounded-lg border-2 border-blue-500/50 bg-slate-800/70 p-6 md:scale-110">
              <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white">
                {t("benefits.commission.recommended")}
              </div>
              <div className="mb-2 text-3xl font-bold text-blue-400">30%</div>
              <p className="text-slate-300">
                {t("benefits.commission.premium")}
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/70 p-6">
              <div className="mb-2 text-3xl font-bold text-blue-400">40%</div>
              <p className="text-slate-300">{t("benefits.commission.vip")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AffiliateBenefits;
