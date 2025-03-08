"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ArrowRight, LifeBuoy, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export default function FAQContentFixed() {
  const t = useTranslations("Faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Categories with their respective questions
  const categories = {
    all: [
      "q1",
      "q2",
      "q3",
      "q4",
      "q5",
      "q6",
      "q7",
      "q8",
      "q9",
      "q10",
      "q11",
      "q12",
    ],
    getting_started: ["q1", "q2", "q3"],
    pricing_plans: ["q4", "q5", "q6"],
    features: ["q7", "q8", "q9"],
    technical: ["q10", "q11", "q12"],
  };

  // Filter questions based on search and category
  const filteredQuestions = categories[
    selectedCategory as keyof typeof categories
  ].filter((q) => {
    if (!searchQuery) return true;

    const question = t(`questions.${q}.question`).toLowerCase();
    const answer = t(`questions.${q}.answer`).toLowerCase();
    return (
      question.includes(searchQuery.toLowerCase()) ||
      answer.includes(searchQuery.toLowerCase())
    );
  });

  // Custom rendering for specific question answers with HTML elements
  const renderAnswer = (questionId: string) => {
    const answer = t(`questions.${questionId}.answer`);

    // Custom rendering for question 2 (Getting started)
    if (questionId === "q2") {
      return (
        <div className="space-y-2">
          <p>Getting started is easy:</p>
          <ol className="list-inside list-decimal space-y-1 pl-4">
            <li>Create a free account</li>
            <li>Explore the available smart alerts in the dashboard</li>
            <li>Set up your notification preferences</li>
            <li>Optionally, upgrade to a Pro plan for full access</li>
          </ol>
        </div>
      );
    }

    // Custom rendering for question 7 (Smart Alerts)
    if (questionId === "q7") {
      return (
        <div className="space-y-2">
          <p>
            Smart Alerts are our proprietary trading signals that identify
            potential trading opportunities based on technical analysis, price
            action, and market patterns. Each alert provides key information
            including:
          </p>
          <ul className="list-inside list-disc space-y-1 pl-4">
            <li>Entry price recommendations</li>
            <li>Stop-loss levels</li>
            <li>Target price levels</li>
            <li>Risk/reward ratio</li>
            <li>
              Performance metrics like MAE (Maximum Adverse Excursion) and MFE
              (Maximum Favorable Excursion)
            </li>
          </ul>
        </div>
      );
    }

    // Custom rendering for question 8 (Instruments)
    if (questionId === "q8") {
      return (
        <div className="space-y-2">
          <p>
            Our Smart Alerts cover over 50 different trading instruments
            including:
          </p>
          <ul className="list-inside list-disc space-y-1 pl-4">
            <li>Major futures markets (ES, NQ, YM, RTY)</li>
            <li>Commodities (Gold, Oil, Natural Gas)</li>
            <li>Forex pairs</li>
            <li>And more</li>
          </ul>
          <p>
            Both free and Pro plans have access to different instruments, with
            the Pro plan offering a complete range.
          </p>
        </div>
      );
    }

    // Custom rendering for question 9 (Delivery)
    if (questionId === "q9") {
      return (
        <div className="space-y-2">
          <p>Smart Alerts are delivered through multiple channels:</p>
          <ul className="list-inside list-disc space-y-1 pl-4">
            <li>Directly in the Trader Map platform</li>
            <li>Via Telegram notifications (Pro users only)</li>
            <li>Optional sound alerts in the web application</li>
          </ul>
          <p>
            You can customize your notification preferences in your account
            settings.
          </p>
        </div>
      );
    }

    // For all other questions, just return the text
    return <p>{answer}</p>;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">
      {/* Search and Category Filters */}
      <div className="space-y-6">
        <div className="relative">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder={t("searchPlaceholder")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs
          defaultValue="all"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="all">{t("categories.all")}</TabsTrigger>
            <TabsTrigger value="getting_started">
              {t("categories.getting_started")}
            </TabsTrigger>
            <TabsTrigger value="pricing_plans">
              {t("categories.pricing_plans")}
            </TabsTrigger>
            <TabsTrigger value="features">
              {t("categories.features")}
            </TabsTrigger>
            <TabsTrigger value="technical">
              {t("categories.technical")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* FAQ Accordion */}
      {filteredQuestions.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <Accordion type="single" collapsible className="w-full">
            {filteredQuestions.map((questionId, index) => (
              <motion.div key={questionId} variants={itemVariants}>
                <AccordionItem value={questionId}>
                  <AccordionTrigger className="text-left">
                    <span className="font-medium">
                      {t(`questions.${questionId}.question`)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-w-none text-slate-300 dark:prose-invert">
                      {renderAnswer(questionId)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-dashed border-slate-700 bg-slate-800/30 p-12 text-center">
          <Search className="text-muted-foreground h-8 w-8" />
          <h3 className="text-lg font-medium text-slate-200">
            {t("noResults.title")}
          </h3>
          <p className="text-muted-foreground">{t("noResults.message")}</p>
        </div>
      )}

      {/* Contact Support */}
      <div className="mt-12 rounded-lg border border-slate-700 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-1 text-center md:text-left">
            <h3 className="text-lg font-medium text-slate-200">
              {t("support.title")}
            </h3>
            <p className="text-muted-foreground">{t("support.description")}</p>
          </div>
          <Link href="/contact">
            <Button className="gap-2" size="sm">
              {t("support.button")} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
