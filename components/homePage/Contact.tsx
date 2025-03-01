"use client";

import Image from "next/image";
import hero from "../../public/hero.png";
import ContactForm from "../ContactForm";
import { useTranslations } from "next-intl";
import Faq from "./Faq";

const Contact = () => {
  const t = useTranslations("HomePage.contact");

  return (
    <section className="mt-10 p-12">
      <div className="flex lg:flex-row flex-col w-full items-center justify-around gap-10">
        <div className="space-y-4 p-2 md:p-8">
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
