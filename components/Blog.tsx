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
    <div className="flex flex-col items-center justify-center mt-10 px-20">
      <div className="w-max">
        <Image src={blog.imageUrl} alt="blog image" width={800} height={800} />
      </div>
      <h1 className="text-5xl my-5 font-semibold">{blog.title}</h1>
      <div className="border-t border-gray-300 my-4"></div>
      <p className="">{blog.content}</p>
    </div>
  );
}

export default Blog;
