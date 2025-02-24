import Blog from "@/components/Blog";
import { createClient } from "@/database/supabase/server";
import React from "react";

async function page({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { id } = await params;

  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return <h1>Error loading blog</h1>;

  return (
    <div>
      <Blog blog={blog} />
    </div>
  );
}

export default page;
