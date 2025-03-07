"use client";
import Link from "next/link";
import React from "react";
import FreePlanCard from "./FreePlanCard";
import PlanCard from "../PlanCard";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const Plans = ({ size = "regular" }) => {
  const t = useTranslations("HomePage.plans");

  return (
    <section aria-labelledby="pricing-plans-heading" className="py-16">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-4 px-4 md:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl text-center"
        >
          <span className="mb-2 inline-block rounded-full bg-green-800/30 px-3 py-1 text-xs font-medium text-green-400">
            Pricing
          </span>
          <h2
            id="pricing-plans-heading"
            className="mb-4 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-center text-3xl font-semibold text-transparent md:text-5xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-center text-xl font-light text-slate-300 md:text-2xl">
            {t("subtitle")}
          </p>
        </motion.div>
        <div className="mt-12 grid w-full max-w-5xl grid-cols-1 items-stretch gap-8 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
          <FreePlanCard />
          <PlanCard />
        </div>
        <Link href="/login">
          <motion.p
            whileHover={{ scale: 1.05 }}
            className="mt-8 text-center font-thin text-slate-400 transition-colors hover:text-slate-200"
          >
            {t("loginPrompt")}
          </motion.p>
        </Link>
      </div>
    </section>
  );
};

export default React.memo(Plans);
