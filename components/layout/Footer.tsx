import { useTranslations } from "next-intl";
import {
  Mail,
  Twitter,
  Facebook,
  Instagram,
  Globe,
  MapPin,
} from "lucide-react";
import { Link } from "@/i18n/routing";

const Footer = () => {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 pb-8 pt-16">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col items-center justify-between gap-8 border-b border-slate-700/50 pb-8 md:flex-row">
          <div className="max-w-sm text-center md:text-left">
            <h2 className="mb-2 text-2xl font-bold text-white">
              {t("companyName")}
            </h2>
            <p className="text-slate-400">
              Advanced trading insights and real-time smart alerts for active
              traders.
            </p>
            <div className="mt-4 flex items-start gap-2 text-left">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
              <p className="text-sm text-slate-400">
                Edisonstraße 63, 12459 Berlin, Germany
                <br />
                Leuchtenfabrik Berlin
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="mailto:info@trader-map.com"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            
            <a
              href="https://facebook.com"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.instagram.com/trader_map2025"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about-us"
                  className="hover:text-primary text-slate-300 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary text-slate-300 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliate"
                  className="hover:text-primary text-slate-300 transition-colors"
                >
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/docs/getting-started"
                  className="hover:text-primary text-slate-300 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="hover:text-primary text-slate-300 transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-primary text-slate-300 transition-colors"
                >
                  {t("links.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-primary text-slate-300 transition-colors"
                >
                  {t("links.terms")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-primary text-slate-300 transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Products</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/smart-alerts"
                  className="hover:text-primary text-slate-300 transition-colors"
                >
                  Smart Alerts
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-primary text-slate-300 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 text-center text-sm text-slate-500 md:flex-row">
          <div>{t("copyright").replace("2025", currentYear.toString())}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
