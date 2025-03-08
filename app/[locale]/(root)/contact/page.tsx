import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getTranslations } from "next-intl/server";
import { Mail, MapPin, Headphones } from "lucide-react";
import { Link } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trader Map | Contact Us",
    description: "Get in touch with our team for support, feedback, or partnership inquiries",
  };
}

export default async function ContactPage() {
  const t = await getTranslations("ContactPage");

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 to-slate-900 py-16">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-slate-300">
              {t("subtitle")}
            </p>
          </div>

          <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 p-8 md:p-12">
            <ContactForm />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Support Email */}
            <div className="rounded-xl border border-slate-700/30 bg-slate-900/50 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/30 p-3">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">
                {t("supportEmailTitle")}
              </h3>
              <p className="text-slate-300">{t("supportEmailDescription")}</p>
              <a
                href="mailto:support@trader-map.com"
                className="mt-2 inline-block text-blue-400 hover:underline"
              >
                support@trader-map.com
              </a>
            </div>
            
            {/* Partnerships */}
            <div className="rounded-xl border border-slate-700/30 bg-slate-900/50 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-900/30 p-3">
                <Headphones className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">
                {t("partnershipsTitle")}
              </h3>
              <p className="text-slate-300">{t("partnershipsDescription")}</p>
              <a
                href="mailto:partners@trader-map.com"
                className="mt-2 inline-block text-blue-400 hover:underline"
              >
                partners@trader-map.com
              </a>
            </div>
            
            {/* Affiliate Program */}
            <div className="rounded-xl border border-slate-700/30 bg-slate-900/50 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900/30 p-3">
                <MapPin className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">
                {t("affiliateTitle")}
              </h3>
              <p className="text-slate-300">{t("affiliateDescription")}</p>
              <Link
                href="/affiliate"
                className="mt-2 inline-block text-blue-400 hover:underline"
              >
                {t("affiliateLink")} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
