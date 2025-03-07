"use client";

import { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import { Book, ScanSearch } from "lucide-react";
import { motion } from "framer-motion";

interface Blog {
  id: string;
  title: string;
  date: string;
  imageUrl?: string;
  subTitle?: string;
  content?: string;
}

interface BlogListProps {
  locale: string;
}

export default function BlogList({ locale }: BlogListProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs?locale=${locale}`);

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [locale]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-900/30 p-3">
            <Book className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
            <p className="text-slate-400">Loading articles...</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl bg-slate-800/50 p-4"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-red-700 p-8 text-center">
        <ScanSearch className="mb-4 h-12 w-12 text-red-500" />
        <h3 className="mb-1 text-xl font-medium text-slate-400">
          Error loading blogs
        </h3>
        <p className="max-w-md text-sm text-slate-500">{error}</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 p-8 text-center">
        <ScanSearch className="mb-4 h-12 w-12 text-slate-500" />
        <h3 className="mb-1 text-xl font-medium text-slate-400">
          No blogs found
        </h3>
        <p className="max-w-md text-sm text-slate-500">
          There are currently no blog posts available in this language.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-blue-900/30 p-3">
          <Book className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-slate-400">
            Explore our latest articles and insights
          </p>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {blogs.map((blog: Blog) => (
          <motion.div key={blog.id} variants={item}>
            <BlogCard blog={blog} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
