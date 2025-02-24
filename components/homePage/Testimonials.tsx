import React from "react";
import TestimonialCard from "./TestimonialCard";
import Carousel from "../Carousel";
import supabase from "@/database/supabase/supabase";





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
      
      <Carousel>{slides}</Carousel>
    </section>
  );
};

export default Testimonials;
