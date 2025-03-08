"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const AffiliateFAQ = () => {
  const t = useTranslations("AffiliatePage");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { questionKey: "eligibility", answerKey: "eligibilityAnswer" },
    { questionKey: "tracking", answerKey: "trackingAnswer" },
    { questionKey: "payment", answerKey: "paymentAnswer" },
    { questionKey: "materials", answerKey: "materialsAnswer" },
    { questionKey: "terms", answerKey: "termsAnswer" },
    { questionKey: "support", answerKey: "supportAnswer" },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-slate-900 py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white">
            {t("faq.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-300">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`flex w-full items-center justify-between rounded-lg px-6 py-4 text-left ${
                  openIndex === index
                    ? "border border-blue-700/30 bg-gradient-to-r from-blue-900/30 to-indigo-900/30"
                    : "border border-slate-700/50 bg-slate-800/50"
                }`}
              >
                <h3 className="text-lg font-medium text-white">
                  {t(`faq.questions.${faq.questionKey}`)}
                </h3>
                <ChevronDown
                  className={`transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  } text-slate-400`}
                  size={20}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-b-lg border-x border-b border-slate-700/50 bg-slate-800/20 px-6 py-4">
                      <p className="text-slate-300">
                        {t(`faq.answers.${faq.answerKey}`)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-300">
            {t("faq.moreQuestions")}
            <a href="#signup" className="ml-1 text-blue-400 hover:underline">
              {t("faq.contactUs")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AffiliateFAQ;
