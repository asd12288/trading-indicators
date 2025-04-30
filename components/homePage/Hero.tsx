"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";

// Lazy load the DemoCard component which isn't needed for initial render
const DemoCard = dynamic(() => import("@/components/demo/DemoCards"), {
  loading: () => (
    <div className="h-[550px] w-full animate-pulse rounded-lg bg-slate-800"></div>
  ),
  ssr: false, // Disable SSR to reduce initial load
});

// Define card types for the carousel - organized by instrument
const demoCards = [
  { type: "running", instrument: "EURUSD", side: "Short" },
  { type: "fulfilled", instrument: "EURUSD", side: "Long" },
];

export default function Hero() {
  const t = useTranslations("HomePage.hero");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Lazily load the card only after the critical content is rendered
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Delay loading the card component
      const timer = setTimeout(() => {
        setIsCardVisible(true);
      }, 100); // Short delay to prioritize text rendering first

      return () => clearTimeout(timer);
    }
  }, []);

  // Improved auto-rotate with transition handling
  useEffect(() => {
    if (!isCardVisible) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % demoCards.length);
        setIsTransitioning(false);
      }, 300); // Brief delay for transition
    }, 8000); // Change card every 8 seconds

    return () => clearInterval(interval);
  }, [isCardVisible]);

  const currentCard = demoCards[currentCardIndex];

  // Handle manual card change with transition
  const handleCardChange = (index: number) => {
    if (isTransitioning || index === currentCardIndex) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentCardIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <section className="relative px-4 pb-16 pt-8 md:py-16">
      <div className="relative mx-auto max-w-7xl">
        {/* Main hero content with improved layout and better vertical centering */}
        <div className="flex min-h-[650px] flex-col items-center justify-center gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Text content with enhanced styling - CRITICAL for LCP */}
          <div className="max-w-2xl pt-0 text-center lg:text-left">
            {/* Remove initial animation to improve LCP */}
            <div>
              <span className="inline-block rounded-full bg-gradient-to-r from-emerald-900/20 to-teal-900/20 px-5 py-1.5 text-sm font-semibold text-emerald-500">
                {t("rating")}
              </span>
              {/* <p className="mt-3 text-sm font-light text-emerald-600/80">
                {t("count")}
              </p> */}
              <h1 className="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                <span className="block bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  Smart Alert
                </span>
                <span className="mt-2 block">{t("highlightedText")}</span>
              </h1>
              <p className="mt-8 text-xl leading-8 text-slate-300">
                {t("subtitle")}
              </p>
              <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  href="/signup"
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-700 to-teal-600 px-8 py-3 text-lg font-medium text-white shadow-lg transition-all hover:from-emerald-600 hover:to-teal-500 hover:shadow-emerald-800/20"
                >
                  <span className="relative z-10 flex items-center">
                    {t("buttons.joinUs")}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link
                  href="/info"
                  className="group flex items-center gap-2 text-base font-medium text-slate-300 transition-colors hover:text-white"
                >
                  {t("buttons.learnMore")}
                  <span className="rounded-full bg-slate-800 p-1 transition-transform group-hover:translate-x-1">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
              <p className="mt-6 text-sm text-slate-400">{t("noCard")}</p>
            </div>
          </div>

          {/* Card component - load conditionally after critical content */}
          {isCardVisible && (
            <div className="w-full max-w-md pt-0 lg:pt-0">
              <div className="relative">
                {/* Subtle glow effect behind the card */}
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-800/15 to-blue-800/15 blur-xl"></div>

                <div className="relative h-[550px]">
                  <div
                    className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
                  >
                    <DemoCard
                      key={`${currentCard.instrument}-${currentCard.type}-${currentCard.side}`}
                      type={currentCard.type as any}
                      instrumentName={currentCard.instrument}
                      tradeSide={currentCard.side as any}
                    />
                  </div>
                </div>

                {/* Card indicators */}
                <div className="mt-4 flex justify-center gap-3">
                  {demoCards.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                        index === currentCardIndex
                          ? "scale-110 bg-emerald-600 shadow-lg shadow-emerald-700/30"
                          : "bg-slate-700 hover:bg-slate-600"
                      }`}
                      onClick={() => handleCardChange(index)}
                      disabled={isTransitioning}
                      aria-label={`View demo card ${index + 1}`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
