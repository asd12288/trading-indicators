import React from "react";
import BlogCard from "./BlogCard";
import { BlogProps } from "@/lib/Blog";

async function BlogList({ blogs }) {
  return (
    <ul className="grid md:grid-cols-3">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </ul>
  );
}

export default BlogList;
