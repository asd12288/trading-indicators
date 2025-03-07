import Image from "next/image";
import React from "react";
import { MdFormatQuote } from "react-icons/md";
import avatar from "../../public/avatar.png";

const TestimonialCard = ({ testmonial }) => {
  return (
    <div className="group relative m-3 flex h-auto min-h-[320px] w-72 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:m-4 md:w-80 lg:w-96">
      {/* Decorative elements */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/5 opacity-50 blur-xl transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-500/5 blur-xl"></div>

      {/* Quote icon with better styling */}
      <div className="relative mb-4">
        <div className="absolute -left-1 -top-1 text-indigo-500/20">
          <MdFormatQuote size={50} />
        </div>
        <div className="text-indigo-400">
          <MdFormatQuote size={30} />
        </div>
      </div>

      {/* Testimonial content with improved typography */}
      <p className="relative mb-6 text-left text-sm leading-relaxed text-slate-300 md:text-base">
        "{testmonial.content}"
      </p>

      {/* User information with better layout */}
      <div className="relative mt-auto flex items-center gap-4 border-t border-slate-700/50 pt-4">
        <div className="flex-shrink-0 overflow-hidden rounded-full border-2 border-indigo-500/20">
          <Image
            src={testmonial.imageUrl || avatar}
            width={50}
            height={50}
            alt={`${testmonial.name}'s avatar`}
            className="h-10 w-10 object-cover transition-transform duration-300 group-hover:scale-110 md:h-12 md:w-12"
          />
        </div>
        <div>
          <h4 className="font-medium text-white md:text-lg">
            {testmonial.name}
          </h4>
          <p className="text-xs text-slate-400 md:text-sm">
            {testmonial.subText}
          </p>
        </div>

        {/* Rating stars if applicable */}
        {testmonial.rating && (
          <div className="ml-auto flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${i < testmonial.rating ? "text-amber-400" : "text-slate-600"}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialCard;
