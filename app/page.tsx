import Hero from "@/components/homePage/Hero";
import Offers from "@/components/homePage/Offers";
import Plans from "@/components/homePage/Plans";
import Service from "@/components/homePage/Service";
import Testimonials from "@/components/homePage/Testimonials";
import Contact from "@/components/homePage/Contact";
import { Suspense } from "react";

function page() {
  return (
    <>
      <section className="mt:p-8 p-2">
        <Hero />
      </section>

      <section className="mt:p-8 p-2">
          <Offers />
      </section>

      <section className="mt:p-8 p-2">
        <Service />
      </section>

      <section className="mt:p-8 p-2">
        <Plans />
      </section>

      <section className="mt:p-8 z-50 p-2">
        <Testimonials />
      </section>

      <section className="mt:p-8 p-2">
        <Contact />
      </section>
    </>
  );
}

export default page;
