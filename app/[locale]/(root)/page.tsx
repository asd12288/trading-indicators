import Contact from "@/components/homePage/Contact";
import Hero from "@/components/homePage/Hero";
import Offers from "@/components/homePage/Offers";
import Plans from "@/components/homePage/Plans";
import Service from "@/components/homePage/Service";
import TestimonialsSection from "@/components/homePage/TestimonialsSection";


function page() {

  
  return (
    <>
      <section className="p-2">
        <Hero />
      </section>

      {/* <section className="p-2">
        <Offers />
      </section> */}

      <section className="md:p-20">
        <Service />
      </section>

      <section className="p-2">
        <Plans />
      </section>

      <section className="z-50 p-2">
        <TestimonialsSection />
      </section>

      <section className="p-2">
        <Contact />
      </section>
    </>
  );
}

export default page;
