"use client";
import React, { useState, useEffect } from "react";
import TestimonialCard from "./TestimonialCard";
import Carousel from "../Carousel";
import supabase from "@/database/supabase/supabase";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

interface Testimonial {
  id: string;
  content: string;
  name: string;
  imageUrl?: string;
  subText?: string;
  rating?: number;
}

const Testimonials = ({ useInfiniteScroll = false }) => {
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

  // Format testimonials for InfiniteMovingCards
  const formattedTestimonials = testimonials.map((testimonial) => ({
    quote: testimonial.content,
    name: testimonial.name,
    title: testimonial.subText || "",
    imageUrl: testimonial.imageUrl,
    rating: testimonial.rating,
  }));

  const slides = testimonials.map((testimonial) => (
    <TestimonialCard key={testimonial.id} testmonial={testimonial} />
  ));

  // Use InfiniteMovingCards if useInfiniteScroll prop is true
  if (useInfiniteScroll && testimonials.length > 0) {
    return (
      <section className="relative py-10">
        <InfiniteMovingCards
          items={formattedTestimonials}
          direction="right"
          speed="slow"
        />
      </section>
    );
  }

  // Otherwise, use the traditional carousel
  return (
    <section className="relative">
      <Carousel>{slides}</Carousel>
    </section>
  );
};

export default Testimonials;
