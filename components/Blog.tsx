import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";

interface BlogProps {
  blog: {
    title: string;
    content: string;
    id: string;
    imageUrl: string;
    subTitle: string;
  };
}

function Blog({ blog }: BlogProps) {
  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12 text-slate-200 md:px-16">
      <div className="w-full max-w-3xl rounded-xl bg-slate-800 p-6 shadow-lg md:p-10">
        
        {/* Blog Image */}
        <div className="relative h-64 w-full overflow-hidden rounded-lg md:h-80">
          <Image
            src={blog.imageUrl}
            alt="Blog image"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        {/* Blog Title & Subtitle */}
        <h1 className="mt-6 text-center text-4xl font-bold text-slate-100">
          {blog.title}
        </h1>
        <h2 className="mt-2 text-center text-xl">{blog.subTitle}</h2>
        <div className="my-4 border-t border-slate-600"></div>

        {/* Blog Content with Custom Markdown Styles */}
        <article className="prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-4xl font-bold text-white" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-3xl font-semibold text-white" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-2xl font-semibold text-gray-300" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-lg text-gray-300" {...props} />
              ),
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </article>

      </div>
    </div>
  );
}

export default Blog;
