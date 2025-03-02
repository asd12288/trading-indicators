"use client";
import { useTranslations } from "next-intl";
import ContactForm from "../ContactForm";
import Faq from "./Faq";

const Contact = () => {
  const t = useTranslations("HomePage.contact");

  return (
    <section className="mt-10 md:px-12">
      <div className="flex w-full flex-col items-center justify-around gap-10 lg:flex-row">
        <div className="space-y-4 md:p-8">
          <h2 className="text-3xl font-semibold md:text-5xl">{t("title")}</h2>
          <p className="text-sm md:text-lg">{t("subtitle")}</p>
          <div className="w-full">
            <ContactForm />
          </div>
        </div>

        <div className="w-full">
          <Faq />
        </div>
      </div>
    </section>
  );
};

export default Contact;
