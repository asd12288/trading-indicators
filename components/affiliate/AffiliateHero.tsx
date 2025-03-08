"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Users } from "lucide-react";

const AffiliateHero = () => {
  const t = useTranslations("AffiliatePage");

  return (
    <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 py-16 md:py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-slate-300">
            {t("hero.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3"
        >
          {/* Commission Feature */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-900/30 p-3">
              <DollarSign className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              {t("hero.features.commission.title")}
            </h3>
            <p className="text-slate-300">
              {t("hero.features.commission.description")}
            </p>
          </div>

          {/* Conversion Feature */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-900/30 p-3">
              <TrendingUp className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              {t("hero.features.conversion.title")}
            </h3>
            <p className="text-slate-300">
              {t("hero.features.conversion.description")}
            </p>
          </div>

          {/* Support Feature */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-900/30 p-3">
              <Users className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              {t("hero.features.support.title")}
            </h3>
            <p className="text-slate-300">
              {t("hero.features.support.description")}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <a
            href="#signup"
            className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700"
          >
            {t("hero.cta")}
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default AffiliateHero;
