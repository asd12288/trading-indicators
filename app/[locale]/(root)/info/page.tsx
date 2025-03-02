import Image from "next/image";
import React from "react";
import runningCard from "@/public/runningCard.png";
import fulfilledCard from "@/public/fufiledCard.png";
import SignalTool from "@/components/SignalCard/SignalTool";
import { useTranslations } from "next-intl";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Info",
};

export default function FeatureDocsPage() {
  const t = useTranslations("InfoPage");

  return (
    <div className="min-h-screen w-full p-6 text-slate-50 md:p-12">
      <div className="mx-auto max-w-6xl rounded-lg bg-slate-900 p-8 shadow-lg">
        {/* Page Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">
            {t("mainTitle")}
          </h1>
          <p className="mt-4 text-lg text-slate-300">{t("welcome")}</p>
        </header>

        {/* Section: Core Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white">{t("sections.coreFeatures.title")}</h2>
          <ul className="mt-4 space-y-3 text-slate-300">
            <li>
              <strong>Trader Map</strong>: {t("sections.coreFeatures.items.traderMap")}
            </li>
            <li>
              <strong>Signals</strong>: {t("sections.coreFeatures.items.signals")}
            </li>
            <li>
              <strong>Profile</strong>: {t("sections.coreFeatures.items.profile")}
            </li>
          </ul>
        </section>

        {/* Section: Trading Terms */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white">{t("sections.tradingTerms.title")}</h2>
          <div className="mt-4 space-y-6 text-slate-300">
            {["mae", "mfe", "exitPrice", "tradeDuration"].map((term) => (
              <div key={term}>
                <h3 className="text-lg font-semibold text-white">
                  {t(`sections.tradingTerms.terms.${term}.title`)}
                </h3>
                <p className="mt-1">{t(`sections.tradingTerms.terms.${term}.description`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Signal Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white">{t("sections.signalCards.title")}</h2>
          <p className="mt-2 text-slate-300">{t("sections.signalCards.description")}</p>

          {/* Running Signal Card */}
          <div className="mt-6 flex flex-col gap-6 md:flex-row">
            <div className="flex-1 rounded-md bg-slate-800 p-6 shadow-md">
              <h3 className="text-lg font-semibold text-white">{t("sections.signalCards.running.title")}</h3>
              <p className="mt-2">{t("sections.signalCards.running.description")}</p>
              <ul className="ml-5 mt-3 list-disc space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i}>{t(`sections.signalCards.running.item${i}`)}</li>
                ))}
              </ul>
            </div>
            <Image
              src={runningCard}
              alt="Running Signal Card"
              className="h-60 w-auto rounded-md shadow-md md:h-72"
            />
          </div>

          {/* Fulfilled Signal Card */}
          <div className="mt-6 flex flex-col-reverse gap-6 md:flex-row">
            <Image
              src={fulfilledCard}
              alt="Fulfilled Signal Card"
              className="h-60 w-auto rounded-md shadow-md md:h-72"
            />
            <div className="flex-1 rounded-md bg-slate-800 p-6 shadow-md">
              <h3 className="text-lg font-semibold text-white">{t("sections.signalCards.fulfilled.title")}</h3>
              <p className="mt-2">{t("sections.signalCards.fulfilled.description")}</p>
              <ul className="ml-5 mt-3 list-disc space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i}>{t(`sections.signalCards.fulfilled.item${i}`)}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section: Signal Tool */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white">{t("sections.signalTool.title")}</h2>
          <p className="mt-2 text-slate-300">{t("sections.signalTool.description")}</p>

          <div className="mt-6 flex flex-col items-center space-y-6 md:flex-row md:justify-around">
            {["notifications", "volume", "favorite"].map((item) => (
              <div key={item} className="w-full max-w-sm rounded-md bg-slate-800 p-6 shadow-md">
                <strong className="block text-lg font-semibold text-white">{t(`sections.signalTool.items.${item}`)}</strong>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center rounded-lg bg-slate-800 p-6 shadow-md">
            <SignalTool userId="0e4aab79-6b31-4917-88a8-0e1cb02a6f9f" signalId="NQ" />
          </div>
        </section>

        {/* Section: Alerts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white">{t("sections.alerts.title")}</h2>
          <p className="mt-2 text-slate-300">{t("sections.alerts.description")}</p>
          <div className="mt-6 flex items-center justify-center rounded-lg bg-slate-800 p-6 shadow-md">
            <h4 className="animate-pulse text-center text-lg font-semibold">{t("sections.alerts.sampleAlert")}</h4>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-400">
          <hr className="mb-4 border-slate-700" />
          <p className="text-sm">&copy; {new Date().getFullYear()} Trader Map. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
