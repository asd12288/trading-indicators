"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import PricingCard from "../pricing/PricingCard";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";

const Plans = ({ size = "regular" }) => {
  const t = useTranslations("HomePage.plans");
  const planT = useTranslations("HomePage.planCards");
  const { locale } = useParams();

  const plans = [
    {
      name: planT("free.name"),
      price: "0",
      description: planT("free.description"),
      features: [
        planT("free.features.feature1"),
        planT("free.features.feature2"),
        planT("free.features.feature3"),
      ],
      cta: planT("free.cta"),
      href: `${locale}/signup`,
      popular: false,
      tier: "free",
      billingPeriod: "monthly",
    },
    {
      name: planT("monthly.name"),
      price: "65",
      description: planT("monthly.description"),
      features: [
        planT("monthly.features.feature1"),
        planT("monthly.features.feature2"),
        planT("monthly.features.feature3"),
        planT("monthly.features.feature4"),
        planT("monthly.features.feature5"),
      ],
      cta: planT("monthly.cta"),
      href: `${locale}/signup`,
      popular: false,
      tier: "monthly",
      billingPeriod: "monthly",
    },
    {
      name: planT("lifetime.name"),
      price: "800",
      description: planT("lifetime.description"),
      features: [
        planT("lifetime.features.feature1"),
        planT("lifetime.features.feature2"),
        planT("lifetime.features.feature3"),
        planT("lifetime.features.feature4"),
        planT("lifetime.features.feature5"),
      ],
      cta: planT("lifetime.cta"),
      href: `${locale}/signup`,
      popular: true,
      tier: "lifetime",
      billingPeriod: "oneTime",
    },
  ];

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
        <div className="mt-12 grid w-full max-w-6xl grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.tier} {...plan} />
          ))}
        </div>
        <Link href="/signup">
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
