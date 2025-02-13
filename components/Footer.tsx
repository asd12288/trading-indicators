import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <section className="bottom absolute flex w-full items-center justify-between bg-slate-900 p-8 text-white">
      <div>
        <h4 className="text-3xl font-semibold">World Trade Signals</h4>
        <p className="text-thin mt-3">
          © 2025 Company Co. All rights reserved.
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
