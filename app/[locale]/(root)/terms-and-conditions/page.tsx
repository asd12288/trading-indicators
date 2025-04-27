import { Metadata } from "next";
import { useTranslations } from "next-intl";
import React from "react";
import { Link } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Terms and Conditions",
};

const TermsAndConditions = () => {
  const t = useTranslations("TermsAndConditions");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-12 text-white md:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl">
        {/* Header with icon */}
        <div className="mb-8 flex items-center justify-center md:justify-start">
          <div className="mr-4 rounded-full bg-green-700/20 p-3">
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            {t("title")}
          </h1>
        </div>

        {/* Welcome card */}
        <div className="mb-10 rounded-xl bg-slate-800/60 p-6 shadow-lg backdrop-blur-sm md:p-8">
          <p className="text-lg text-slate-200">{t("welcome")}</p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8 rounded-xl bg-slate-800/60 p-6 shadow-lg backdrop-blur-sm md:p-8">
          {Object.keys(t.raw("sections")).map((section, index) => (
            <div
              key={section}
              className={index > 0 ? "border-t border-slate-700 pt-8" : ""}
            >
              <div className="flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-700/20 text-green-500">
                  {index + 1}
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  {t(`sections.${section}.title`)}
                </h2>
              </div>
              <p className="mt-3 pl-11 text-slate-300">
                {t(`sections.${section}.content`)}
              </p>
            </div>
          ))}
        </div>

        {/* Refund Policy Reference */}
        <div className="mt-10 rounded-xl bg-slate-800/60 p-6 shadow-lg backdrop-blur-sm md:p-8">
          <div className="flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-700/20 text-blue-500">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-slate-200">
              For information about our refund policies, please visit our{" "}
              <Link
                href="/refund-policy"
                className="text-blue-400 underline hover:text-blue-300"
              >
                Refund Policy
              </Link>{" "}
              page.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-sm text-slate-400">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
