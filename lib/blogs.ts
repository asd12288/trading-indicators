import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { cache } from "react";

// Mark these functions as server-side only
export const getBlogContent = cache(async (slug: string, locale: string) => {
  // Add this directive to ensure this code only runs on the server
  "use server";

  const blogDir = path.join(process.cwd(), "content/blogs");

  // First try with the exact slug
  let filePath = path.join(blogDir, locale, `${slug}.md`);

  // If file doesn't exist, try to find a matching file
  if (!fs.existsSync(filePath)) {
    console.log(
      `Blog file not found at ${filePath}, looking for alternatives...`,
    );

    // Check if directory exists
    const localeDir = path.join(blogDir, locale);
    if (!fs.existsSync(localeDir)) {
      console.error(`Locale directory not found: ${localeDir}`);
      return {
        title: "Not Found",
        content: `<p>Sorry, this post is not available in ${locale}.</p>`,
        imageUrl: "",
        subTitle: "",
        date: "",
      };
    }

    // List all files in the directory and try to find a match
    const files = fs.readdirSync(localeDir);
    const matchingFile = files.find((file) => {
      const fileSlug = file.replace(".md", "");
      return fileSlug === slug || fileSlug.toLowerCase() === slug.toLowerCase();
    });

    if (matchingFile) {
      filePath = path.join(localeDir, matchingFile);
      console.log(`Found matching file: ${matchingFile}`);
    } else {
      console.error(`No matching file found for slug: ${slug}`);
      return {
        title: "Not Found",
        content: `<p>Sorry, this post is not available in ${locale}.</p>`,
        imageUrl: "",
        subTitle: "",
        date: "",
      };
    }
  }

  try {
    console.log(`Reading blog content from: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // Calculate reading time (approx 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return {
      title: data.title || slug,
      date: data.date || "",
      imageUrl: data.imageUrl || "",
      subTitle: data.subTitle || "",
      content: content, // Return raw markdown content for ReactMarkdown
      readingTime,
    };
  } catch (error) {
    console.error("Error reading blog content:", error);
    return {
      title: "Error",
      content: "<p>Error loading content.</p>",
      imageUrl: "",
      subTitle: "",
      date: "",
    };
  }
});

export const getAllBlogs = cache(async (locale: string) => {
  // Add this directive to ensure this code only runs on the server
  "use server";

  const blogDir = path.join(process.cwd(), "content/blogs");
  const dir = path.join(blogDir, locale);

  try {
    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir);
    return files.map((file) => {
      const slug = file.replace(".md", "");
      const fileContent = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(fileContent);

      return {
        id: slug,
        title: data.title || slug,
        date: data.date || "",
        imageUrl: data.imageUrl || "",
        subTitle: data.subTitle || "",
      };
    });
  } catch (error) {
    console.error("Error reading blogs list:", error);
    return [];
  }
});
