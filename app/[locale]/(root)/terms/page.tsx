import { Metadata } from "next";
import { useTranslations } from "next-intl";
import React from "react";



export const metadata: Metadata = {
  title: "Terms and Conditions",
};



const TermsAndConditions = () => {
  const t = useTranslations("TermsAndConditions");

  return (
    <div className="min-h-screen px-6 py-12 text-slate-200 md:px-16">
      <div className="mx-auto max-w-4xl rounded-xl bg-slate-800 p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-slate-100">{t("title")}</h1>
        <p className="mb-4 text-slate-300">{t("welcome")}</p>

        {/* Terms Sections */}
        {Object.keys(t.raw("sections")).map((section) => (
          <div key={section}>
            <h2 className="mt-6 text-2xl font-semibold text-slate-100">
              {t(`sections.${section}.title`)}
            </h2>
            <p className="mt-2 text-slate-300">
              {t(`sections.${section}.content`)}
            </p>
          </div>
        ))}
      </div>

      {/* Refund Policy */}
      <div className="mx-auto mt-12 max-w-4xl rounded-xl bg-slate-800 p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-slate-100">
          {t("refund.title")}
        </h1>

        {Object.keys(t.raw("refund.sections")).map((section) => (
          <div key={section}>
            <h2 className="mt-6 text-2xl font-semibold text-slate-100">
              {t(`refund.sections.${section}.title`)}
            </h2>
            <p className="mt-2 text-slate-300">
              {t(`refund.sections.${section}.content`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsAndConditions;
