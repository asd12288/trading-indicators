"use client";

import React from "react";
import { Timeline } from "../ui/timeline";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

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
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      content: (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3 rounded-xl border border-slate-700/30 bg-gradient-to-br from-slate-800/80 to-slate-900 p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-indigo-100 md:text-3xl">
            {t("monitoring.heading")}
          </h3>
          <p className="text-sm text-slate-300 md:text-lg">
            {t("monitoring.description")}
          </p>
        </motion.div>
      ),
    },
    {
      title: t("analysis.title"),
      icon: (
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
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
      content: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3 rounded-xl border border-slate-700/30 bg-gradient-to-br from-slate-800/80 to-slate-900 p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-teal-100 md:text-3xl">
            {t("analysis.heading")}
          </h3>
          <p className="text-sm text-slate-300 md:text-lg">
            {t("analysis.description")}
          </p>
        </motion.div>
      ),
    },
    {
      title: t("alertGeneration.title"),
      icon: (
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
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      ),
      content: (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-3 rounded-xl border border-slate-700/30 bg-gradient-to-br from-slate-800/80 to-slate-900 p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-amber-100 md:text-3xl">
            {t("alertGeneration.heading")}
          </h3>
          <p className="text-sm text-slate-300 md:text-lg">
            {t("alertGeneration.description")}
          </p>
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
          Our Process
        </span>
        <h2 className="section-title mb-6 mt-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          {t("title")}
        </h2>
        <div className="mx-auto h-1 w-16 rounded-full bg-indigo-500/50"></div>
      </motion.div>

      <div className="relative z-10">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-transparent to-indigo-500/10 blur-3xl"></div>
        <div className="relative z-20 p-4 md:p-8">
          <Timeline data={data} />
        </div>
      </div>
    </div>
  );
};

export default HowItWork;
