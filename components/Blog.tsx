import Image from "next/image";
import React from "react";
import { Calendar, Clock, ChevronLeft, Share2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "./ui/button";

interface BlogProps {
  blog: {
    title: string;
    content: string;
    id: string;
    imageUrl: string;
    subTitle: string;
    date: string;
    readingTime?: number;
  };
}

function Blog({ blog }: BlogProps) {
  // Extract headings for table of contents
  const extractHeadings = () => {
    if (typeof window === "undefined") return [];

    const article = document.querySelector("article");
    if (!article) return [];

    const headings = Array.from(article.querySelectorAll("h2, h3"));
    return headings.map((heading) => ({
      id: heading.id,
      text: heading.textContent || "",
      level: heading.tagName === "H2" ? 2 : 3,
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero section with image */}
      <div className="relative h-80 w-full md:h-96 lg:h-[500px]">
        <Image
          src={blog.imageUrl || "/images/placeholder-blog.jpg"}
          alt={blog.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/blogs"
              className="mb-4 inline-flex items-center text-blue-400 transition-colors hover:text-blue-300"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              <span>Back to blogs</span>
            </Link>

            <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              {blog.title}
            </h1>

            <p className="mb-6 text-xl text-slate-200">{blog.subTitle}</p>

            <div className="flex items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4 text-blue-400" />
                <span>{formatDate(blog.date)}</span>
              </div>

              {blog.readingTime && (
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-blue-400" />
                  <span>{blog.readingTime} min read</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-16 md:px-0">
        <div className="relative z-10 mx-auto -mt-10 max-w-4xl overflow-hidden rounded-lg bg-slate-800 shadow-xl">
          <div className="flex flex-col md:flex-row">
            {/* Main content */}
            <div className="flex-grow p-6 md:p-10">
              <article className="prose prose-lg prose-invert max-w-none prose-headings:text-blue-300 prose-p:text-slate-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-hr:border-slate-700">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </article>

              <hr className="my-8 border-slate-700" />

              {/* Share section */}
              <div className="flex items-center justify-between">
                <Link href="/blogs">
                  <Button
                    variant="outline"
                    className="border-slate-700 bg-slate-800/50 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to blogs
                  </Button>
                </Link>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Share:</span>
                  <button
                    onClick={() =>
                      window.navigator
                        .share?.({
                          title: blog.title,
                          text: blog.subTitle,
                          url: window.location.href,
                        })
                        .catch(() => {})
                    }
                    className="rounded-full bg-slate-700 p-2 text-slate-200 transition-colors hover:bg-blue-600"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Table of contents - only on desktop */}
            <div className="hidden w-64 border-l border-slate-700 p-6 md:block">
              <div className="sticky top-6">
                <h4 className="mb-4 text-lg font-semibold text-white">
                  Table of Contents
                </h4>
                <nav className="toc text-sm">
                  {extractHeadings().map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className={`block py-1 text-slate-400 transition-colors hover:text-blue-400 ${
                        heading.level === 3 ? "pl-4" : ""
                      }`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>

                {/* Reading progress - could be enhanced with JS */}
                <div className="mt-8">
                  <h4 className="mb-1 text-sm font-medium text-slate-400">
                    Reading Progress
                  </h4>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full w-0 bg-blue-500"
                      id="reading-progress"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Client-side code to update the reading progress
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    // Add IDs to headings for the table of contents after the content is loaded
    setTimeout(() => {
      document
        .querySelectorAll("article h2, article h3")
        .forEach((heading, index) => {
          if (!heading.id) {
            heading.id = `heading-${index}`;
          }
        });

      // Update the table of contents if it exists
      const tocElement = document.querySelector(".toc");
      if (tocElement) {
        const article = document.querySelector("article");
        if (!article) return;

        const headings = Array.from(article.querySelectorAll("h2, h3"));
        tocElement.innerHTML = "";

        headings.forEach((heading) => {
          const id = heading.id;
          const text = heading.textContent || "";
          const level = heading.tagName === "H2" ? 2 : 3;

          const link = document.createElement("a");
          link.href = `#${id}`;
          link.textContent = text;
          link.className = `block py-1 text-slate-400 transition-colors hover:text-blue-400 ${
            level === 3 ? "pl-4" : ""
          }`;

          tocElement.appendChild(link);
        });
      }
    }, 500);

    // Set up the reading progress indicator
    const progressBar = document.getElementById("reading-progress");
    if (progressBar) {
      const updateProgress = () => {
        const scrollTop = window.scrollY;
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${progress}%`;
      };

      window.addEventListener("scroll", updateProgress);
      updateProgress(); // Initialize on page load
    }
  });
}

export default Blog;
