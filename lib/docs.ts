'use server'

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";

// Directory where docs content is stored
const docsDirectory = path.join(process.cwd(), "content/docs");

// Get document content by slug and locale
export async function getDocContent(slug: string, locale: string = "en") {
  const fullPath = path.join(docsDirectory, locale, `${slug}.md`);

  // Default content if file doesn't exist
  if (!fs.existsSync(fullPath)) {
    return {
      title: "Document Not Found",
      body: "<p>The requested document could not be found.</p>",
      slug,
    };
  }

  // Read markdown file
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Parse frontmatter and content
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML
  const processedContent = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug) // Adds id attributes to headings
    .use(rehypeStringify)
    .processSync(content)
    .toString();

  // Get next and previous docs for navigation
  const allDocs = await getAllDocs(locale);
  const currentIndex = allDocs.findIndex((doc) => doc.slug === slug);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc =
    currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  return {
    title: data.title || slug,
    description: data.description || "",
    body: processedContent,
    slug,
    prevDoc,
    nextDoc,
  };
}

// Get all available docs for a locale with flexible sorting
export async function getAllDocs(locale: string = "en") {
  const localeDir = path.join(docsDirectory, locale);

  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(localeDir);

  const docs = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(localeDir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      
      // Add order property from frontmatter or default to 999
      return {
        slug,
        title: data.title || slug,
        description: data.description || "",
        order: data.order || 999,
      };
    });

  // Custom sort order
  const priorityOrder = [
    "getting-started",
    "introduction",
    "smart-alert",
    "mfe-mae-trading",
  ];
  
  return docs.sort((a, b) => {
    // First try to sort by explicit order in frontmatter
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    
    // Then by priority list
    const aIndex = priorityOrder.indexOf(a.slug);
    const bIndex = priorityOrder.indexOf(b.slug);
    
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    // Finally alphabetically
    return a.title.localeCompare(b.title);
  });
}

// Get documentation sections for the docs landing page
export async function getDocsSections(locale: string = "en") {
  return (await getAllDocs(locale)).map((doc) => ({
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
  }));
}

// Extract headings from HTML content for table of contents
export async function extractHeadings(html: string) {
  const headings: Array<{ id: string; text: string; level: number }> = [];

  // Match all h2, h3, h4 headings with their ids
  const headingRegex = /<h([2-4])\s+id="([^"]+)"[^>]*>(.*?)<\/h\1>/g;
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];

    // Remove any HTML tags from heading text
    const text = match[3].replace(/<[^>]*>/g, "");

    headings.push({ id, text, level });
  }

  return headings;
}
