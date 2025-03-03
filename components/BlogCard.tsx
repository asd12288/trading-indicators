import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { Link } from "@/i18n/routing";

function BlogCard({ blog }) {
  return (
    <div className="mx-auto my-4 w-96 max-w-lg overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-lg transition-all hover:shadow-xl">
      <Link href={`/blog/${blog.id}`}>
        <div className="relative h-56 w-full">
          <Image
            className="object-cover"
            src={blog.imageUrl}
            alt={`${blog.title} image`}
            layout="fill"
          />
        </div>
      </Link>
      <div className="p-5">
        <h5 className="mb-2 text-xl font-semibold text-slate-100">
          {blog.title.slice(0, 50)}...
        </h5>
        <p className="mb-4 text-sm text-slate-300">
          {blog.subTitle && blog.subTitle.length > 100
            ? blog.subTitle.slice(0, 100) + "..."
            : blog.subTitle}
        </p>
        <Link href={`/blog/${blog.id}`}>
          <Button className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
            Read more
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;
