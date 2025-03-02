import Image from "next/image";
import React from "react";
import { MdFormatQuote } from "react-icons/md";
import avatar from "../../public/avatar.png";

const TestimonialCard = ({ testmonial }) => {
  return (
    <div className="z-500 m-2 h-56 w-48 md:space-y-5 space-y-2 rounded-3xl bg-slate-800 p-6 md:h-96 md:w-96">
      <MdFormatQuote className="text-2xl md:text-5xl" />
      <p className="text-left text-xs font-light leading-tight md:text-lg">
        {testmonial.content}
      </p>
      <div className="flex items-center gap-4">
        <div>
          <Image
            src={testmonial.imageUrl || avatar}
            width={50}
            height={50}
            alt="avatar"
            className="h-6 w-6 rounded-full md:h-12 md:w-12"
          />
        </div>
        <div className="mt-2">
          <h4 className="text-xs font-medium md:text-lg">{testmonial.name}</h4>
          <p className="md:text-sm text-sx font-light">{testmonial.subText}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
