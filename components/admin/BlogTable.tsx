import React from "react";
import { DataTable } from "./DataTable";
import { blogTableColumns } from "./blogTableColumns";

const BlogTable = ({ posts }) => {
  return <DataTable columns={blogTableColumns} data={posts} type="posts" />;
};

export default BlogTable;
