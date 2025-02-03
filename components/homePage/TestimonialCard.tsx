import Image from "next/image";
import React from "react";
import { MdFormatQuote } from "react-icons/md";
import avatar from "../../public/avatar.png";

const TestimonialCard = ({ testmonial }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg w-96 space-y-5 m-2 h-96 z-500 ">
      <MdFormatQuote className="text-5xl" />
      <p className="text-lg font-light text-left">{testmonial.content}</p>
      <div className="flex items-center gap-4">
        <div>
          <Image
            src={testmonial.imageUrl || avatar}
            width={50}
            height={50}
            alt="avatar"
            className="rounded-full h-12 w-12"
          />
        </div>
        <div>
          <h4 className="text-lg font-medium">{testmonial.name}</h4>
          <p className="text-sm font-light">{testmonial.subText}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
