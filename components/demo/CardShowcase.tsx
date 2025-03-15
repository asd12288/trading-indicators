"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DemoCard from "./DemoCards";

type CardInfo = {
  type: "running" | "fulfilled" | "marketClosed" | "systemClosed";
  instrumentName: string;
  tradeSide?: "Long" | "Short";
};

interface CardShowcaseProps {
  cards: CardInfo[];
  interval?: number; // Time in ms between card transitions
  autoRotate?: boolean;
  className?: string;
}

export default function CardShowcase({
  cards,
  interval = 7000,
  autoRotate = true,
  className = "",
}: CardShowcaseProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate through cards
  useEffect(() => {
    if (!autoRotate) return;
    
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
        setIsAnimating(false);
      }, 300); // Animation duration
    }, interval);

    return () => clearInterval(timer);
  }, [cards.length, interval, autoRotate]);

  const currentCard = cards[currentCardIndex];

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`card-${currentCardIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          <DemoCard
            type={currentCard.type}
            instrumentName={currentCard.instrumentName}
            tradeSide={currentCard.tradeSide}
          />
        </motion.div>
      </AnimatePresence>

      {/* Card indicators/navigation dots */}
      {cards.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {cards.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentCardIndex ? "bg-indigo-500" : "bg-slate-700"
              }`}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentCardIndex(index);
                  setIsAnimating(false);
                }, 300);
              }}
              disabled={isAnimating}
              aria-label={`View card ${index + 1}`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}
