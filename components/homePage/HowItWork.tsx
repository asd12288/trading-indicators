"use client";

import React from "react";
import { Timeline } from "../ui/timeline";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRightIcon,
  BarChart2Icon,
  GaugeIcon,
  AlertCircleIcon,
  ActivityIcon,
} from "lucide-react";
import { Link } from "@/i18n/routing";

type TimelineEntry = {
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
};

const HowItWork = () => {
  const t = useTranslations("HomePage.howItWork");

  const data: TimelineEntry[] = [
    {
      title: t("monitoring.title"),
      icon: (
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
          <GaugeIcon className="h-6 w-6" />
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            1
          </span>
        </div>
      ),
      content: (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 rounded-xl border border-slate-700/30 bg-gradient-to-br from-slate-800/80 to-slate-900 p-6 shadow-lg"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-semibold text-indigo-100 md:text-3xl">
                {t("monitoring.heading")}
              </h3>
              <p className="text-sm text-slate-300 md:text-base">
                {t("monitoring.description")}
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-blue-400">•</span>
                  <span>Real-time market data analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-blue-400">•</span>
                  <span>Continuous price movement tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-blue-400">•</span>
                  <span>Multiple exchanges monitored simultaneously</span>
                </li>
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-lg md:h-64 md:w-80">
              <Image
                src="/images/market-monitoring.png"
                alt="Market monitoring dashboard"
                className="rounded-lg object-cover"
                width={400}
                height={300}
                priority={false}
              />
              <div className="absolute bottom-3 right-3 rounded-full bg-blue-600/80 p-2 backdrop-blur-sm">
                <ActivityIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-blue-400"
            >
              <ArrowRightIcon className="h-8 w-8" />
            </motion.div>
          </div>
        </motion.div>
      ),
    },
    {
      title: t("analysis.title"),
      icon: (
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/20 text-teal-400">
          <BarChart2Icon className="h-6 w-6" />
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
            2
          </span>
        </div>
      ),
      content: (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 rounded-xl border border-slate-700/30 bg-gradient-to-br from-slate-800/80 to-slate-900 p-6 shadow-lg"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-lg md:order-first md:h-64 md:w-80">
              <Image
                src="/images/data-analysis.png"
                alt="Advanced data analysis with charts and indicators"
                className="rounded-lg object-cover"
                width={400}
                height={300}
                priority={false}
              />
              <div className="absolute bottom-3 right-3 rounded-full bg-teal-600/80 p-2 backdrop-blur-sm">
                <BarChart2Icon className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-semibold text-teal-100 md:text-3xl">
                {t("analysis.heading")}
              </h3>
              <p className="text-sm text-slate-300 md:text-base">
                {t("analysis.description")}
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-teal-400">•</span>
                  <span>Pattern recognition algorithms</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-teal-400">•</span>
                  <span>Trend strength evaluation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-teal-400">•</span>
                  <span>Historical performance correlation</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-teal-400"
            >
              <ArrowRightIcon className="h-8 w-8" />
            </motion.div>
          </div>
        </motion.div>
      ),
    },
    {
      title: t("alertGeneration.title"),
      icon: (
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
          <AlertCircleIcon className="h-6 w-6" />
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
            3
          </span>
        </div>
      ),
      content: (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 rounded-xl border border-slate-700/30 bg-gradient-to-br from-slate-800/80 to-slate-900 p-6 shadow-lg"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-semibold text-amber-100 md:text-3xl">
                {t("alertGeneration.heading")}
              </h3>
              <p className="text-sm text-slate-300 md:text-base">
                {t("alertGeneration.description")}
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-amber-400">•</span>
                  <span>Instant trading notifications</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-amber-400">•</span>
                  <span>Multi-channel delivery (app, email, SMS)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-amber-400">•</span>
                  <span>Detailed entry and exit points</span>
                </li>
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-lg md:h-64 md:w-80">
              <Image
                src="/images/smart-alerts.png"
                alt="Smart trading alerts on multiple devices"
                className="rounded-lg object-cover"
                width={400}
                height={300}
                priority={false}
              />
              <div className="absolute bottom-3 right-3 rounded-full bg-amber-600/80 p-2 backdrop-blur-sm">
                <AlertCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-green-400"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <p className="flex-1 text-center text-sm font-medium text-green-300 md:text-base">
              Your trading opportunity is ready - all you need to do is execute!
            </p>
          </div>
        </motion.div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-12 text-center"
      >
        <span className="inline-block rounded-full bg-slate-700/60 px-3 py-1 text-sm font-medium text-slate-200">
          Smart Process
        </span>
        <h2 className="section-title mb-6 mt-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400 md:text-lg">
          Our system continuously monitors markets, analyzes price movements,
          and delivers actionable alerts - all automated to give you the trading
          edge.
        </p>
        <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-indigo-500/50"></div>
      </motion.div>

      <div className="relative z-10">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-transparent to-indigo-500/10 blur-3xl"></div>
        <div className="relative z-20 p-4 md:p-8">
          <Timeline data={data} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mx-auto mt-12 max-w-xl rounded-xl border border-slate-700/30 bg-slate-800/50 p-6 text-center shadow-lg backdrop-blur-sm"
        >
          <h3 className="text-lg font-medium text-white md:text-xl">
            Ready to experience the power of Smart Alerts?
          </h3>
          <p className="mt-3 text-slate-300">
            Our system handles the complex market analysis so you can focus on
            making successful trades.
          </p>
          <Link href="/signup">
            <button className="mt-6 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 px-8 py-3 text-white shadow-lg transition-transform hover:scale-105">
              Get Started Now
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(HowItWork);
