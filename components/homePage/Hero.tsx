"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import DemoCard from "@/components/demo/DemoCards";

// Define card types for the carousel - focus only on ES and NQ
const demoCards = [
  { type: "running", instrument: "ES", side: "Long" },
  { type: "running", instrument: "NQ", side: "Short" },
  { type: "fulfilled", instrument: "ES", side: "Short" },
  { type: "fulfilled", instrument: "NQ", side: "Long" },
];

export default function Hero() {
  const t = useTranslations("HomePage.hero");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  // Auto-rotate through demo cards
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % demoCards.length);
    }, 8000); // Change card every 8 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const currentCard = demoCards[currentCardIndex];

  return (
    <section className="relative px-4 pt-8 pb-16 md:py-16">
      <div className="relative mx-auto max-w-7xl">
        {/* Main hero content with improved layout and better vertical centering */}
        <div className="flex min-h-[700px] flex-col items-center justify-center gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Text content with enhanced styling */}
          <div className="max-w-2xl pt-0 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block rounded-full bg-gradient-to-r from-emerald-900/20 to-teal-900/20 px-5 py-1.5 text-sm font-semibold text-emerald-500">
                {t("rating")}
              </span>
              <p className="mt-3 text-sm font-light text-emerald-600/80">
                {t("count")}
              </p>
              <h1 className="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                <span className="block bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  Smart Alert
                </span>
                <span className="mt-2 block">
                  {t("highlightedText")}
                </span>
              </h1>
              <p className="mt-8 text-xl leading-8 text-slate-300">
                {t("subtitle")}
              </p>
              <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/signup"
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-700 to-teal-600 px-8 py-3 text-lg font-medium text-white shadow-lg transition-all hover:shadow-emerald-800/20 hover:from-emerald-600 hover:to-teal-500"
                >
                  <span className="relative z-10 flex items-center">
                    {t("buttons.joinUs")}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 blur transition-opacity group-hover:opacity-70"></span>
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
              <p className="mt-6 text-sm text-slate-400">
                {t("noCard")}
              </p>
            </motion.div>
          </div>

          {/* Fixed card positioning */}
          <motion.div 
            className="w-full max-w-md pt-0 lg:pt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative">
              {/* Subtle glow effect behind the card - darker */}
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-800/15 to-blue-800/15 blur-xl"></div>
              
              {/* Floating animation wrapper */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 1, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="relative h-[550px]"
              >
                <DemoCard 
                  type={currentCard.type as any}
                  instrumentName={currentCard.instrument}
                  tradeSide={currentCard.side as any}
                />
              </motion.div>
              
              {/* Card indicators - darker */}
              <div className="mt-4 flex justify-center gap-3">
                {demoCards.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      index === currentCardIndex 
                        ? "bg-emerald-600 scale-110 shadow-lg shadow-emerald-700/30" 
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                    onClick={() => setCurrentCardIndex(index)}
                    aria-label={`View demo card ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
