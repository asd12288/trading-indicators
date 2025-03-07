import { NextResponse } from "next/server";
import { getAllBlogs } from "@/lib/blogs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";

  const blogs = await getAllBlogs(locale);

  return NextResponse.json(blogs);
}
