"use client";
import { useTranslations } from "next-intl";
import ContactForm from "../ContactForm";
import Faq from "./Faq";
import { motion } from "framer-motion";

const Contact = () => {
  const t = useTranslations("HomePage.contact");

  return (
    <section className="mb-16 mt-20 px-4 md:px-12">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-slate-100 md:text-5xl">
            {t("sectionTitle") || "Get in Touch"}
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            {t("sectionDescription") ||
              "We're here to help with any questions you might have about our service."}
          </p>
        </motion.div>

        <div className="flex w-full flex-col items-stretch justify-between gap-16 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl shadow-black/20"
          >
            <div>
              <h2 className="mb-2 text-3xl font-semibold text-slate-100 md:text-4xl">
                {t("title")}
              </h2>
              <p className="mb-6 text-slate-400">{t("subtitle")}</p>
            </div>
            <div className="w-full">
              <ContactForm />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <Faq />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
