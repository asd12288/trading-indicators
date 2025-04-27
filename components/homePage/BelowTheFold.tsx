"use client";

import Service from "@/components/homePage/Service";
import HowItWork from "@/components/homePage/HowItWork";
import Plans from "@/components/homePage/Plans";
import TestimonialsSection from "@/components/homePage/TestimonialsSection";
import Cta from "@/components/homePage/Cta";
import Contact from "@/components/homePage/Contact";

export default function BelowTheFold() {
  return (
    <>
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
    </>
  );
}
