import { Metadata } from "next";
import AffiliateHero from "@/components/affiliate/AffiliateHero";
import AffiliateBenefits from "@/components/affiliate/AffiliateBenefits";
import AffiliateHowItWorks from "@/components/affiliate/AffiliateHowItWorks";
import AffiliateSignupForm from "@/components/affiliate/AffiliateSignupForm";
import AffiliateFAQ from "@/components/affiliate/AffiliateFAQ";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trader Map | Affiliate Program",
    description:
      "Join our affiliate program and earn commissions by promoting our trading insights platform",
  };
}

export default async function AffiliatePage() {
  const t = await getTranslations("AffiliatePage");

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 to-slate-900">
      <AffiliateHero />
      <AffiliateBenefits />
      <AffiliateHowItWorks />
      <AffiliateFAQ />
      <AffiliateSignupForm />
    </main>
  );
}
