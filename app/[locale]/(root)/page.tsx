import Contact from "@/components/homePage/Contact";
import Cta from "@/components/homePage/Cta";
import Hero from "@/components/homePage/Hero";
import HowItWork from "@/components/homePage/HowItWork";
import Plans from "@/components/homePage/Plans";
import Service from "@/components/homePage/Service";
import TestimonialsSection from "@/components/homePage/TestimonialsSection";
import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";

async function page({ params }: { params: { locale: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect({ href: "/smart-alerts", locale: params.locale });
  }

  return (
    <>
      <div className="relative">
        <section>
          <Hero />
        </section>

        <section className="relative">
          <Service />
        </section>

        <section className="relative">
          <HowItWork />
        </section>

        <section className="relative p-2">
          <Plans />
        </section>

        <section className="relative z-[1] p-2">
          <TestimonialsSection />
        </section>

        <section className="relative">
          <Cta />
        </section>

        <section className="relative p-2">
          <Contact />
        </section>
      </div>
    </>
  );
}

export default page;
