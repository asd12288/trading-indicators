import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const blogDir = path.join(process.cwd(), "content/blogs");

export function getBlogContent(slug: string, locale: string) {
  // e.g., /content/blog/en/first-post.md
  const filePath = path.join(blogDir, locale, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return {
      title: "Not Found",
      content: `<p>Sorry, this post is not available in ${locale}.</p>`,
    };
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    title: data.title || slug,
    date: data.date || "",
    // Convert Markdown to HTML
    content: marked(content),
  };
}

export function getAllBlogs(locale: string) {
  const dir = path.join(blogDir, locale);
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
}
