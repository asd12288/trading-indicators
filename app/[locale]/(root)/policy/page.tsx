import { useTranslations } from "next-intl";
import React from "react";

const PrivacyPolicy = () => {
  const t = useTranslations("PrivacyPolicy");

  return (
    <div className="min-h-screen px-6 py-12 text-slate-200 md:px-16">
      <div className="mx-auto max-w-4xl rounded-xl bg-slate-800 p-8 shadow-lg">
        <h1 className="mb-6 text-4xl font-semibold text-slate-100">
          {t("title")}
        </h1>
        <p className="text-sm text-slate-300">
          <strong>{t("effectiveDate")}</strong> 2025-01-01
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-slate-100 underline">
          {t("sections.collect.title")}
        </h2>
        <p className="mt-2 text-slate-300">{t("sections.collect.content")}</p>

        <h2 className="mt-6 text-2xl font-semibold text-slate-100 underline">
          {t("sections.use.title")}
        </h2>
        <p className="mt-2 text-slate-300">{t("sections.use.content")}</p>

        <h2 className="mt-6 text-2xl font-semibold text-slate-100 underline">
          {t("sections.security.title")}
        </h2>
        <p className="mt-2 text-slate-300">{t("sections.security.content")}</p>

        <h2 className="mt-6 text-2xl font-semibold text-slate-100 underline">
          {t("sections.rights.title")}
        </h2>
        <p className="mt-2 text-slate-300">{t("sections.rights.content")}</p>

        <h2 className="mt-6 text-2xl font-semibold text-slate-100 underline">
          {t("sections.changes.title")}
        </h2>
        <p className="mt-2 text-slate-300">{t("sections.changes.content")}</p>

        <h2 className="mt-6 text-2xl font-semibold text-slate-100 underline">
          {t("sections.contact.title")}
        </h2>
        <p className="mt-2 text-slate-300">{t("sections.contact.content")}</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
