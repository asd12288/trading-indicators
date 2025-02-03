import Image from "next/image";
import Link from "next/link";
import React from "react";

function BlogCard({ blog }) {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-slate-200 border-gray-200 rounded-lg max-w-sm mb-5 w-96 h-180">
        <Link href={`/blog/${blog.id}`}>
          <Image
            className="rounded-t-lg object-cover"
            src={blog.imageUrl}
            alt="blog image"
            width={400}
            height={192}
          />
        </Link>
        <div className="p-5 flex flex-col justify-between h-full">
          <h5 className="text-gray-950 font-medium text-xl tracking-tight mb-2">
            {blog.title}
          </h5>
          <p className="font-normal text-gray-950 mb-3 text-sm">
            {blog.subTitle}
          </p>
          <Link href={`/blog/${blog.id}`}>
            <button className="text-white bg-green-700 rounded-lg text-sm font-medium hover:bg-green-800 py-2 px-2 inline ">
              Read more
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
