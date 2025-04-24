"use client";

import dynamic from "next/dynamic";

// Lazy-load each section as a client component
const Service = dynamic(() => import("@/components/homePage/Service"), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse bg-gray-200" />,
});
const HowItWork = dynamic(() => import("@/components/homePage/HowItWork"), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse bg-gray-200" />,
});
const Plans = dynamic(() => import("@/components/homePage/Plans"), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse bg-gray-200" />,
});
const TestimonialsSection = dynamic(
  () => import("@/components/homePage/TestimonialsSection"),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full animate-pulse bg-gray-200" />,
  },
);
const Cta = dynamic(() => import("@/components/homePage/Cta"), {
  ssr: false,
  loading: () => <div className="h-32 w-full animate-pulse bg-gray-200" />,
});
const Contact = dynamic(() => import("@/components/homePage/Contact"), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse bg-gray-200" />,
});

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
