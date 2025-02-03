import React from "react";
import supabase from "@/utils/supabase";
import TestimonialCard from "./TestimonialCard";
import Carousel from "../Carousel";

const Testimonials = async () => {
  const { data: testmonials, error } = await supabase
    .from("testmonials")
    .select("*");

  if (error || !testmonials) {
    return <p>Error loading testimonials</p>;
  }

  const slides = testmonials.map((testmonial) => (
    <TestimonialCard key={testmonial.id} testmonial={testmonial} />
  ));

  return (
    <section className="relative">
      <h2 className="mb-8 text-center text-3xl font-semibold lg:text-5xl">
        Hear what are users say about us
      </h2>
      <Carousel>{slides}</Carousel>
    </section>
  );
};

export default Testimonials;
