import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import React from "react";
import { FaTwitter, FaDiscord, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <section className="relative w-full bg-gradient-to-t from-slate-950 to-slate-900 px-6 py-12 text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between space-y-8 md:flex-row md:space-y-0">
        <div className="text-center md:text-left">
          <h4 className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
            {t("companyName")}
          </h4>
          <p className="mt-3 text-sm font-light text-slate-300">
            {t("copyright")}
          </p>
          <div className="mt-5 flex items-center justify-center space-x-1 md:justify-start">
            <FaEnvelope className="text-slate-400" size={14} />
            <a
              href="mailto:support@trader-map.com"
              className="text-xs text-slate-400 transition-colors hover:text-green-400"
            >
              support@trader-map.com
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6 md:items-end md:space-y-6">
          <div className="flex space-x-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-slate-800 p-2 text-slate-400 transition-all hover:bg-slate-700 hover:text-white"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-slate-800 p-2 text-slate-400 transition-all hover:bg-slate-700 hover:text-white"
            >
              <FaDiscord size={18} />
            </a>
          </div>

          <div className="flex space-x-6">
            <Link
              href={`/policy`}
              className="text-sm text-slate-400 underline-offset-4 hover:text-white hover:underline"
            >
              {t("links.privacy")}
            </Link>
            <Link
              href={`/terms`}
              className="text-sm text-slate-400 underline-offset-4 hover:text-white hover:underline"
            >
              {t("links.terms")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
