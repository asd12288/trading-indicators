import { Metadata } from "next";
import { useTranslations } from "next-intl";
import React from "react";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Our refund policy for all services and subscriptions",
};

const RefundPolicy = () => {
  const t = useTranslations("TermsAndConditions.refund");

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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            {t("title")}
          </h1>
        </div>

        

        {/* Refund Policy Content */}
        <div className="rounded-xl bg-green-900/20 p-6 shadow-lg backdrop-blur-sm md:p-8">
          <div className="mb-6 flex items-center">
            <div className="mr-4 rounded-full bg-green-700/30 p-2">
              <svg
                className="h-6 w-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {t("title")}
            </h2>
          </div>

          <div className="space-y-6">
            {Object.keys(t.raw("sections")).map((section, index) => (
              <div
                key={section}
                className={index > 0 ? "border-t border-green-800/40 pt-6" : ""}
              >
                <h3 className="mb-2 text-xl font-semibold text-green-300">
                  {t(`sections.${section}.title`)}
                </h3>
                <p className="text-slate-300">
                  {t(`sections.${section}.content`)}
                </p>
              </div>
            ))}
          </div>
        </div>



      
      </div>
    </div>
  );
};

export default RefundPolicy;
