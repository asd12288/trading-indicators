import Image from "next/image";
import React from "react";
import runningCard from "@/public/runningCard.png";
import fulfilledCard from "@/public/fufiledCard.png";
import SignalTool from "@/components/SignalCard/SignalTool";
import { useTranslations } from "next-intl";

export default function FeatureDocsPage() {
  const t = useTranslations("InfoPage");

  return (
    <div className="min-h-screen w-full p-6 text-slate-50 md:p-12">
      <div className="mx-auto max-w-6xl rounded-lg bg-slate-900 p-6">
        <h1 className="mb-6 text-4xl font-bold text-white">{t("mainTitle")}</h1>
        <p className="mb-12 text-slate-300">{t("welcome")}</p>

        {/* 1. Core Features */}
        <section className="mb-16">
          <h2 className="mb-2 text-2xl font-bold text-white">
            1. {t("sections.coreFeatures.title")}
          </h2>
          <ul className="ml-4 list-disc space-y-2 text-slate-300">
            <li>
              <strong>Trader Map</strong>:{" "}
              {t("sections.coreFeatures.items.traderMap")}
            </li>
            <li>
              <strong>Signals</strong>:{" "}
              {t("sections.coreFeatures.items.signals")}
            </li>
            <li>
              <strong>Profile</strong>:{" "}
              {t("sections.coreFeatures.items.profile")}
            </li>
          </ul>
        </section>

        {/* 2. Trading Terms */}
        <section className="mb-16">
          <h2 className="mb-2 text-2xl font-bold text-white">
            2. {t("sections.tradingTerms.title")}
          </h2>
          <div className="space-y-6 text-slate-300">
            <div>
              <h3 className="text-xl font-semibold text-slate-100">
                {t("sections.tradingTerms.terms.mae.title")}
              </h3>
              <p className="mt-2">
                {t("sections.tradingTerms.terms.mae.description")}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-100">
                {t("sections.tradingTerms.terms.mfe.title")}
              </h3>
              <p className="mt-2">
                {t("sections.tradingTerms.terms.mfe.description")}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-100">
                {t("sections.tradingTerms.terms.exitPrice.title")}
              </h3>
              <p className="mt-2">
                {t("sections.tradingTerms.terms.exitPrice.description")}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-100">
                {t("sections.tradingTerms.terms.tradeDuration.title")}
              </h3>
              <p className="mt-2">
                {t("sections.tradingTerms.terms.tradeDuration.description")}
              </p>
            </div>
          </div>
        </section>

        {/* 3. Signal Cards */}
        <section className="mb-16">
          <h2 className="mb-2 text-2xl font-bold text-white">
            3. {t("sections.signalCards.title")}
          </h2>
          <p className="mb-4 text-slate-300">
            {t("sections.signalCards.description")}
          </p>
          <div className="space-y-4 text-slate-300">
            {/* Running Signal Card */}
            <div className="flex items-center justify-between gap-8">
              <div className="flex-1 rounded-md bg-slate-800 p-4">
                <h3 className="text-xl font-semibold text-white">
                  {t("sections.signalCards.running.title")}
                </h3>
                <p className="mt-2">
                  {t("sections.signalCards.running.description")}
                </p>
                <ul className="ml-5 mt-2 list-disc space-y-2">
                  <li>{t("sections.signalCards.running.item0")}</li>
                  <li>{t("sections.signalCards.running.item1")}</li>
                  <li>{t("sections.signalCards.running.item2")}</li>
                  <li>{t("sections.signalCards.running.item3")}</li>
                  <li>{t("sections.signalCards.running.item4")}</li>
                </ul>
              </div>
              <div className="flex h-[480px] w-96 items-center justify-center rounded-md bg-slate-800 p-4">
                <Image src={runningCard} alt="Running Signal Card" />
              </div>
            </div>

            {/* Fulfilled Signal Card */}
            <div className="flex items-center justify-between gap-8">
              <div className="flex h-[480px] w-96 items-center justify-center rounded-md bg-slate-800 p-4">
                <Image src={fulfilledCard} alt="Fulfilled Signal Card" />
              </div>
              <div className="flex-1 rounded-md bg-slate-800 p-4">
                <h3 className="text-xl font-semibold text-white">
                  {t("sections.signalCards.fulfilled.title")}
                </h3>
                <p className="mt-2">
                  {t("sections.signalCards.fulfilled.description")}
                </p>
                <ul className="ml-5 mt-2 list-disc space-y-2">
                  <li>{t("sections.signalCards.fulfilled.item0")}</li>
                  <li>{t("sections.signalCards.fulfilled.item1")}</li>
                  <li>{t("sections.signalCards.fulfilled.item2")}</li>
                  <li>{t("sections.signalCards.fulfilled.item3")}</li>
                  <li>{t("sections.signalCards.fulfilled.item4")}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Signal Tool */}
        <section className="mb-16">
          <h2 className="mb-2 text-2xl font-bold text-white">
            4. {t("sections.signalTool.title")}
          </h2>
          <p className="mb-4 text-slate-300">
            {t("sections.signalTool.description")}
          </p>
          <ul className="ml-5 list-disc space-y-5 text-slate-300">
            <li>
              <strong>Notifications</strong>:{" "}
              {t("sections.signalTool.items.notifications")}
            </li>
            <li>
              <strong>Volume</strong>: {t("sections.signalTool.items.volume")}
            </li>
            <li>
              <strong>Favorite</strong>:{" "}
              {t("sections.signalTool.items.favorite")}
            </li>
          </ul>

          <div className="mt-8 flex items-center justify-center rounded-lg bg-slate-800 py-4">
            <SignalTool
              userId="0e4aab79-6b31-4917-88a8-0e1cb02a6f9f"
              signalId="NQ"
            />
          </div>
        </section>

        {/* 5. Alerts */}
        <section className="mb-16">
          <h2 className="mb-2 text-2xl font-bold text-white">
            5. {t("sections.alerts.title")}
          </h2>
          <p className="text-slate-300">{t("sections.alerts.description")}</p>
          <div className="mt-8 flex items-center justify-center rounded-lg bg-slate-800 py-4">
            <h4 className="animate-pulse text-center text-sm md:text-xl md:font-semibold">
              {t("sections.alerts.sampleAlert")}
            </h4>
          </div>
        </section>

        {/* CTA Section */}
        {/*
          Uncomment and adapt based on your user authentication state.
          Example:
          { !user ? ( ...signup block... ) : ( ...signals block... ) }
        */}
        {/*
        {!user ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg">{t("cta.noAccount")}</p>
            <Link href="/signup">
              <Button className="bg-green-700 hover:bg-green-800">
                {t("cta.createAccount")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg">{t("cta.readyToTrade")}</p>
            <Link href="/signals">
              <Button className="bg-green-700 hover:bg-green-800">
                {t("cta.viewSignals")}
              </Button>
            </Link>
          </div>
        )}
        */}

        <footer className="mt-16 text-slate-400">
          <hr className="mb-4 border-slate-700" />
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} Trader Map. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
