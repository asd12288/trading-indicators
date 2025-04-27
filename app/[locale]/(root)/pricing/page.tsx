import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  CheckCheck,
  CreditCard,
  Bitcoin,
  DollarSign,
  Lock,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import PricingCard from "@/components/pricing/PricingCard";
import PaymentMethods from "@/components/pricing/PaymentMethods";
import PricingFAQ from "@/components/pricing/PricingFAQ";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trader Map | Pricing Plans",
    description:
      "Choose the trading insights plan that's right for you. Monthly subscription or lifetime access options available with cryptocurrency payment support.",
  };
}

export default async function PricingPage() {
  const t = await getTranslations("PricingPage");

  const plans = [
    {
      name: t("plans.monthly.name"),
      price: "65",
      description: t("plans.monthly.description"),
      features: [
        t("plans.monthly.features.feature1"),
        t("plans.monthly.features.feature2"),
        t("plans.monthly.features.feature3"),
        t("plans.monthly.features.feature4"),
        t("plans.monthly.features.feature5"),
        t("plans.monthly.features.feature6"),
      ],
      cta: t("plans.monthly.cta"),
      href: "/register?plan=monthly",
      popular: false,
      tier: "monthly",
      billingPeriod: "monthly",
    },
    {
      name: t("plans.lifetime.name"),
      price: "800",
      description: t("plans.lifetime.description"),
      features: [
        t("plans.lifetime.features.feature1"),
        t("plans.lifetime.features.feature2"),
        t("plans.lifetime.features.feature3"),
        t("plans.lifetime.features.feature4"),
        t("plans.lifetime.features.feature5"),
        t("plans.lifetime.features.feature6"),
      ],
      cta: t("plans.lifetime.cta"),
      href: "/profile?tab=upgrade",
      popular: true,
      tier: "lifetime",
      billingPeriod: "oneTime",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-slate-300">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            {plans.map((plan) => (
              <PricingCard key={plan.tier} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <PaymentMethods />

      {/* Enterprise Section */}
      <section className="bg-slate-900/50 py-16">
        <div className="container mx-auto px-6">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/20 to-indigo-900/20 p-8 md:p-12">
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
              <div className="rounded-full bg-blue-900/30 p-4">
                <Lock className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                  {t("enterprise.title")}
                </h2>
                <p className="mb-6 text-lg text-slate-300">
                  {t("enterprise.description")}
                </p>
                <Link
                  href="/contact"
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white transition-all hover:from-blue-700 hover:to-indigo-700"
                >
                  {t("enterprise.cta")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <PricingFAQ />

      {/* No Refund Policy */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-slate-800/80 p-4">
              <CreditCard className="h-8 w-8 text-blue-400" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              {t("noRefund.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-300">
              {t("noRefund.description")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
