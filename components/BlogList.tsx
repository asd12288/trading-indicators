import { getAllBlogs } from "@/lib/blogs";
import BlogCard from "./BlogCard";

interface Blog {
  id: string;
  title: string;
  date: string;
  imageUrl?: string;
  subTitle?: string;
  content?: string; // if needed
}

interface BlogListProps {
  locale: string;
}

export default async function BlogList({ locale }: BlogListProps) {
  const blogs = getAllBlogs(locale); // or await if you make it async

  if (blogs.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="font-medium text-4xl">No blogs found</h1>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {blogs.map((blog: Blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </ul>
  );
}
