import { getBlogContent } from "@/lib/blogs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css"; // Syntax highlighting

export default async function BlogPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  const blogData = getBlogContent(slug, locale);

  return (
    <div className="min-h-screen px-6 py-10 md:px-20 lg:px-32">
      <article className="mx-auto max-w-4xl rounded-lg bg-slate-900 p-8 text-white shadow-lg">
        {/* Blog Title */}
        <h1 className="text-4xl font-extrabold text-green-400 md:text-5xl">
          {blogData.title}
        </h1>

        {/* Blog Date */}
        <p className="mt-2 text-sm text-slate-400">
          Published on {blogData.date}
        </p>

        {/* Horizontal Divider */}
        <hr className="my-6 border-slate-700" />

        {/* Blog Content */}
        <div className="prose prose-lg prose-invert max-w-none leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {blogData.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
