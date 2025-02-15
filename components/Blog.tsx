import Image from "next/image";
import React from "react";

interface BlogProps {
  blog: {
    title: string;
    content: string;
    id: string;
    imageUrl: string;
  };
}

function Blog({ blog }: BlogProps) {
  return (
    <div className="min-h-screen  text-slate-200 py-12 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-slate-800 p-6 md:p-10 rounded-xl shadow-lg">
        <div className="w-full h-64 md:h-80 relative rounded-lg overflow-hidden">
          <Image src={blog.imageUrl} alt="Blog image" layout="fill" objectFit="cover" className="rounded-lg" />
        </div>
        <h1 className="text-4xl font-bold text-slate-100 mt-6 text-center">{blog.title}</h1>
        <div className="border-t border-slate-600 my-4"></div>
        <p className="text-slate-300 text-lg leading-relaxed">{blog.content}</p>
      </div>
    </div>
  );
}

export default Blog;
