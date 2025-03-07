"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiHelpCircle,
  FiClock,
  FiDollarSign,
  FiShield,
} from "react-icons/fi";

const Faq = () => {
  const t = useTranslations("HomePage.faq");
  const [searchQuery, setSearchQuery] = useState("");

  // Array of FAQ items with icons
  const faqItems = [
    {
      id: "item-1",
      question: t("question1.question"),
      answer: t("question1.answer"),
      icon: <FiHelpCircle className="text-emerald-500" />,
    },
    {
      id: "item-2",
      question: t("question2.question"),
      answer: t("question2.answer"),
      icon: <FiClock className="text-cyan-500" />,
    },
    {
      id: "item-3",
      question: t("question3.question"),
      answer: t("question3.answer"),
      icon: <FiDollarSign className="text-teal-500" />,
    },
  ];

  // Filter FAQ items based on search query
  const filteredItems = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg shadow-black/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <h4 className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            {t("title") || "Frequently Asked Questions"}
          </h4>
          <FiShield className="h-8 w-8 text-emerald-500" />
        </div>

        {/* Search bar */}
        <div className="relative mb-8">
          <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-slate-500" />
          <input
            type="text"
            placeholder={t("searchPlaceholder") || "Search questions..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {filteredItems.length === 0 ? (
          <p className="py-4 text-center text-slate-400">
            No matching questions found. Please try another search term.
          </p>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {filteredItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="rounded-lg border border-slate-800 px-4"
              >
                <AccordionTrigger className="flex items-center gap-3 py-5 text-left text-lg font-medium hover:no-underline">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 ring-1 ring-slate-700">
                    {item.icon}
                  </span>
                  <span className="flex-grow text-slate-200">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-11 pr-2 leading-7 text-slate-300">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            {t("moreQuestions") || "Can't find what you're looking for?"}
          </p>
          <button className="mt-2 text-sm font-medium text-emerald-500 hover:text-emerald-400 hover:underline">
            {t("contactSupport") || "Contact our support team"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Faq;
