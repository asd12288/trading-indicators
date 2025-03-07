import React from "react";
import { useTranslations } from "next-intl";
import Testimonials from "@/components/homePage/Testimonials";

const TestimonialsSection = () => {
  const t = useTranslations("HomePage.testimonials");

  return (
    <div className="relative my-24 overflow-hidden py-10">
      {/* Background decorative elements */}
      <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 transform rounded-full bg-indigo-500/10 blur-3xl"></div>
      <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"></div>
      <div className="absolute left-0 top-1/3 h-64 w-64 rounded-full bg-green-500/5 blur-3xl"></div>

      {/* Section heading with improved styling */}
      <div className="mb-16 text-center">
        <span className="mb-4 inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400">
          Trusted by Traders
        </span>
        <h2 className="mx-auto max-w-3xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl lg:text-5xl">
          {t("title")}
        </h2>
        <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-indigo-500/50"></div>
      </div>

      {/* Testimonials component */}
      <div className="relative z-10">
        <Testimonials />
      </div>
    </div>
  );
};

export default TestimonialsSection;
