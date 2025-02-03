import React from "react";
import BlogCard from "./BlogCard";

async function BlogList({ blogs }) {
  return (
    <ul className="grid grid-cols-3">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </ul>
  );
}

export default BlogList;
