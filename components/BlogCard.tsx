import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

function BlogCard({ blog }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group mb-5 overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-b from-slate-800 to-slate-900 shadow-lg transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10"
    >
      <Link href={`/blogs/${blog.id}`} className="block overflow-hidden">
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            src={blog.imageUrl || "/images/placeholder-blog.jpg"}
            alt={`${blog.title} image`}
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
        </div>
      </Link>

      <div className="p-6">
        {/* Date indicator */}
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-400" />
          <span className="text-xs text-slate-400">
            {blog.date || "No date"}
          </span>
        </div>

        <Link href={`/blogs/${blog.id}`}>
          <h3 className="mb-3 line-clamp-2 text-xl font-bold text-white transition-colors duration-200 group-hover:text-blue-400">
            {blog.title || "Untitled Blog Post"}
          </h3>
        </Link>

        <p className="mb-4 line-clamp-3 text-sm text-slate-300">
          {blog.subTitle || "No description available for this blog post."}
        </p>

        <Link href={`/blogs/${blog.id}`}>
          <Button
            variant="outline"
            className="mt-2 w-full border-slate-700 bg-slate-800/50 text-blue-400 transition-all duration-200 hover:border-blue-500/50 hover:bg-blue-900/20 hover:text-blue-300"
          >
            <span>Read article</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default BlogCard;
