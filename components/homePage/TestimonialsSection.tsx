import React from "react";
import { useTranslations } from "next-intl";
import Testimonials from "@/components/homePage/Testimonials";

const TestimonialsSection = () => {
  const t = useTranslations("HomePage.testimonials");

  return (
    <div className="my-16 text-center">
      <h2 className="mb-10 text-3xl font-extrabold text-slate-200 lg:text-5xl">
        {t("title")}
      </h2>
      <Testimonials />
    </div>
  );
};

export default TestimonialsSection;
