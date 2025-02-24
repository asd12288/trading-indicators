import React from "react";
import { useTranslations } from "next-intl";

import Testimonials from "@/components/homePage/Testimonials";

const TestimonialsSection = () => {
  const t = useTranslations("HomePage.testimonials");

  return (
    <div>
      <h2 className="mb-8 text-center text-3xl font-semibold lg:text-5xl">
        {t("title")}
      </h2>
      <Testimonials />
    </div>
  );
};

export default TestimonialsSection;
