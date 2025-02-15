import Contact from "@/components/homePage/Contact";
import Hero from "@/components/homePage/Hero";
import Offers from "@/components/homePage/Offers";
import Plans from "@/components/homePage/Plans";
import Service from "@/components/homePage/Service";
import Testimonials from "@/components/homePage/Testimonials";

function page() {
  return (
    <>
      <section className="p-2">
        <Hero />
      </section>

      {/* <section className="p-2">
        <Offers />
      </section> */}

      <section className="p-20">
        <Service />
      </section>

      <section className="p-2">
        <h2 className="text-center text-5xl font-semibold">Plans</h2>
        <p className="mt-4 text-center text-2xl font-light">
          Weve got a plan perfect just for you
        </p>
        <Plans />
        <p className="mt-8 text-center font-thin hover:underline">
          Already got an account? log-in
        </p>
      </section>

      <section className="z-50 p-2">
        <Testimonials />
      </section>

      <section className="p-2">
        <Contact />
      </section>
    </>
  );
}

export default page;
