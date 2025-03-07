import React from "react";
import SignalTool from "@/components/SignalCard/SignalTool";
import { useTranslations } from "next-intl";
import { Metadata } from "next";
import SignalCardsSection from "@/components/Sections/SignalCardsSection";

export const metadata: Metadata = {
  title: "Info",
};

export default function FeatureDocsPage() {
  const t = useTranslations("InfoPage");

  // Pre-translate all necessary strings for the SignalCardsSection
  const signalCardTranslations = {
    running: {
      title: t("sections.signalCards.running.title"),
      description: t("sections.signalCards.running.description"),
      items: Array.from({ length: 5 }).map((_, i) =>
        t(`sections.signalCards.running.item${i}`),
      ),
    },
    fulfilled: {
      title: t("sections.signalCards.fulfilled.title"),
      description: t("sections.signalCards.fulfilled.description"),
      items: Array.from({ length: 5 }).map((_, i) =>
        t(`sections.signalCards.fulfilled.item${i}`),
      ),
    },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 to-slate-900 md:p-6 text-slate-50 md:p-12">
      <div className="container mx-auto max-w-6xl rounded-2xl bg-slate-900/70 p-8 px-4 shadow-xl backdrop-blur-sm md:p-10 md:px-8">
        {/* Page Header */}
        <header className="mb-16 text-center">
          <div className="inline-block rounded-lg bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400">
            Documentation
          </div>
          <h1 className="mt-4 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl lg:text-6xl">
            {t("mainTitle")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            {t("welcome")}
          </p>
          <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-indigo-500"></div>
        </header>

        {/* Section: Core Features */}
        <section className="mb-16 rounded-xl bg-slate-800/50 p-2 backdrop-blur-sm transition-all hover:bg-slate-800/70 md:p-8">
          <div className="mb-6 flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {t("sections.coreFeatures.title")}
            </h2>
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            <li className="rounded-lg bg-slate-700/40 p-5 transition-all hover:bg-slate-700/60 hover:shadow-lg">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              </div>
              <strong className="text-lg text-white">Trader Map</strong>
              <p className="mt-2 text-sm md:text-[1rem] text-slate-300">
                {t("sections.coreFeatures.items.traderMap")}
              </p>
            </li>
            <li className="rounded-lg bg-slate-700/40 p-5 transition-all hover:bg-slate-700/60 hover:shadow-lg">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <strong className="text-lg text-white">Signals</strong>
              <p className="mt-2 text-sm md:text-[1rem] text-slate-300">
                {t("sections.coreFeatures.items.signals")}
              </p>
            </li>
            <li className="rounded-lg bg-slate-700/40 p-5 transition-all hover:bg-slate-700/60 hover:shadow-lg">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <strong className="text-lg text-white">Profile</strong>
              <p className="mt-2 text-sm md:text-[1rem] text-slate-300">
                {t("sections.coreFeatures.items.profile")}
              </p>
            </li>
          </ul>
        </section>

        {/* Section: Trading Terms */}
        <section className="mb-16 rounded-xl bg-slate-800/50 md:p-8 p-2 backdrop-blur-sm transition-all hover:bg-slate-800/70">
          <div className="mb-6 flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <h2 className="md:text-2xl text-xl font-bold text-white">
              {t("sections.tradingTerms.title")}
            </h2>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {["mae", "mfe", "exitPrice", "tradeDuration"].map((term) => (
              <div
                key={term}
                className="rounded-lg bg-slate-700/40 md:p-6 p-2 transition-all hover:-translate-y-1 hover:bg-slate-700/60 hover:shadow-lg"
              >
                <h3 className="flex items-center  text-lg font-semibold text-white">
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400">
                    {term.charAt(0).toUpperCase()}
                  </span>
                  {t(`sections.tradingTerms.terms.${term}.title`)}
                </h3>
                <p className="mt-3 text-sm md:text-[1rem] text-slate-300">
                  {t(`sections.tradingTerms.terms.${term}.description`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Signal Cards Section (Client Component) */}
        <section className="mb-16 rounded-xl bg-slate-800/50 md:p-8 p-2 backdrop-blur-sm transition-all hover:bg-slate-800/70">
          <div className="mb-6 flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {t("sections.signalCards.title")}
            </h2>
          </div>
          <p className="mt-2 text-sm md:text-[1rem] text-slate-300">
            {t("sections.signalCards.description")}
          </p>

          <SignalCardsSection translations={signalCardTranslations} />
        </section>

        {/* Section: Signal Tool */}
        <section className="mb-16 rounded-xl bg-slate-800/50 p-8 backdrop-blur-sm transition-all hover:bg-slate-800/70">
          <div className="mb-6 flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {t("sections.signalTool.title")}
            </h2>
          </div>
          <p className="mb-6 mt-2 text-slate-300">
            {t("sections.signalTool.description")}
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {["notifications", "volume", "favorite"].map((item, index) => (
              <div
                key={item}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-80"></div>
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
                    index === 0
                      ? "bg-red-500/20 text-red-400"
                      : index === 1
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {index === 0 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="1" y="3" width="15" height="13" />
                      <path d="m16 8 2 3 4-5" />
                      <path d="m16 16 2-3 4 5" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  )}
                </div>
                <strong className="block text-lg font-semibold text-white">
                  {t(`sections.signalTool.items.${item}`)}
                </strong>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-lg">
            <SignalTool
              userId="0e4aab79-6b31-4917-88a8-0e1cb02a6f9f"
              signalId="NQ"
            />
          </div>
        </section>

        {/* Section: Alerts */}
        <section className="mb-16 rounded-xl bg-slate-800/50 p-8 backdrop-blur-sm transition-all hover:bg-slate-800/70">
          <div className="mb-6 flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {t("sections.alerts.title")}
            </h2>
          </div>
          <p className="mt-2 text-slate-300">
            {t("sections.alerts.description")}
          </p>
          <div className="mt-6 overflow-hidden rounded-xl bg-gradient-to-r from-red-500/10 to-amber-500/10 p-8 shadow-md">
            <div className="flex items-center">
              <div className="mr-4 flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-red-500/30 text-red-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white">
                {t("sections.alerts.sampleAlert")}
              </h4>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-400">
          <div className="mb-8 flex justify-center space-x-6">
            <a href="#" className="text-slate-500 hover:text-slate-300">
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
                className="h-6 w-6"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-300">
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
                className="h-6 w-6"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-300">
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
                className="h-6 w-6"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
          <div className="mx-auto mb-6 h-px w-16 bg-slate-700"></div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Trader Map. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
