import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <section className="relative bottom-0 flex w-full flex-col items-center justify-center bg-slate-900 p-8 text-center text-white md:flex-row md:justify-between md:text-left">
      <div>
        <h4 className="text-xl font-semibold md:text-3xl">
         Trader Map 
        </h4>
        <p className="text-thin mt-3">
          © 2025 Trader-Map. All rights reserved.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/policy" className="text-slate-50 hover:text-slate-200">
          Privacy Policy
        </Link>
        <Link href="/terms" className="text-slate-50 hover:text-slate-200">
          Terms & Conditions
        </Link>
      </div>
    </section>
  );
};

export default Footer;
