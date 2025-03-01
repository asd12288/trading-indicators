import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const docsDir = path.join(process.cwd(), "content/docs");

export function getDocContent(slug: string, locale: string) {
  const filePath = path.join(docsDir, locale, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return {
      title: "Not Found",
      body: `<p>Sorry, this documentation is not available in ${locale}.</p>`,
    };
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(fileContent);

  return {
    title: data.title || slug,
    body: marked(content),
  };
}
