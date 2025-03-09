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
      <section>
        <div>
          <Hero />
        </div>
      </section>

      <section>
        <div>
          <Service />
        </div>
      </section>

      <section>
        <HowItWork />
      </section>

      <section className="p-2">
        <Plans />
      </section>

      <section className="z-50 p-2">
        <TestimonialsSection />
      </section>

      <section>
        <Cta />
      </section>

      <section className="p-2">
        <Contact />
      </section>

    </>
  );
}

export default page;
