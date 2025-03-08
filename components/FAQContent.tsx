"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LifeBuoy, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FAQContent() {
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
                    <div
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{
                        __html: t(`questions.${questionId}.answer`),
                      }}
                    />
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
          <Button className="gap-2" size="sm">
            {t("support.button")} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
