"use client";
import React, { useState, useEffect } from "react";
import TestimonialCard from "./TestimonialCard";
import Carousel from "../Carousel";
import supabase from "@/database/supabase/supabase";

interface Testimonial {
  id: string;
  content: string;
  name: string;
  imageUrl?: string;
  subText?: string;
  rating?: number;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    supabase
      .from("testmonials")
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          console.error("Error loading testimonials:", error);
          setError("Error loading testimonials");
        } else if (data) {
          setTestimonials(data);
        }
      });
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  const slides = testimonials.map((testimonial) => (
    <TestimonialCard key={testimonial.id} testmonial={testimonial} />
  ));

  return (
    <section className="relative">
      <Carousel>{slides}</Carousel>
    </section>
  );
};

export default Testimonials;
