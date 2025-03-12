import React from "react";
import { DataTable } from "./DataTable";
import { blogTableColumns } from "./blogTableColumns";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

const BlogTable = ({ posts }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-purple-900/30 p-3">
            <BookOpen className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Blog Management</h1>
            <p className="text-slate-400">Manage blog posts and content</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-700/50 px-4 py-2 text-sm">
            <span className="font-medium text-slate-300">Total Posts: </span>
            <span className="text-white">{posts?.length || 0}</span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/80 shadow-lg">
        <DataTable columns={blogTableColumns} data={posts} type="posts" />
      </div>
    </motion.div>
  );
};

export default BlogTable;
