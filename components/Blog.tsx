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
    <div className="flex min-h-screen flex-col items-center px-6 py-12 text-slate-200 md:px-16">
      <div className="w-full max-w-3xl rounded-xl bg-slate-800 p-6 shadow-lg md:p-10">
        <div className="relative h-64 w-full overflow-hidden rounded-lg md:h-80">
          <Image
            src={blog.imageUrl}
            alt="Blog image"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <h1 className="mt-6 text-center text-4xl font-bold text-slate-100">
          {blog.title}
        </h1>
        <div className="my-4 border-t border-slate-600"></div>
        <p className="text-lg leading-relaxed text-slate-300">{blog.content}</p>
      </div>
    </div>
  );
}

export default Blog;
