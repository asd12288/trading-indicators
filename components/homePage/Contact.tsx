"use client";

import React from "react";
import Image from "next/image";
import hero from "../../public/hero.png";
import ContactForm from "../ContactForm";

const Contact = () => {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-around gap-10">
        <div className="space-y-4 md:p-8 p-2">
          <h2 className="text-3xl font-semibold md:text-5xl">Get in Touch</h2>
          <p className="text-sm md:text-lg">
            Have a question? what to contact us?
          </p>
          <div className="w-full">
            <ContactForm />
          </div>
        </div>

        <div className="hidden lg:block">
          <Image src={hero} alt="hero" width={500} height={680} />
        </div>
      </div>
    </section>
  );
};

export default Contact;
