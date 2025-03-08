"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const PricingFAQ = () => {
  const t = useTranslations("PricingPage.faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Get all FAQ items from translations
  const faqItems = [
    { questionKey: "differences", answerKey: "differencesAnswer" },
    { questionKey: "cancel", answerKey: "cancelAnswer" },
    { questionKey: "refund", answerKey: "refundAnswer" },
    { questionKey: "cryptoPayment", answerKey: "cryptoPaymentAnswer" },
    { questionKey: "teamPlans", answerKey: "teamPlansAnswer" },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">{t("title")}</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqItems.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full text-left px-6 py-4 rounded-lg flex justify-between items-center ${
                  openIndex === index
                    ? "bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-700/30"
                    : "bg-slate-800/50 border border-slate-700/50"
                }`}
              >
                <h3 className="text-lg font-medium text-white">
                  {t(`questions.${faq.questionKey}`)}
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
                    <div className="px-6 py-4 bg-slate-800/20 border-x border-b border-slate-700/50 rounded-b-lg">
                      <p className="text-slate-300">
                        {t(`answers.${faq.answerKey}`)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingFAQ;
