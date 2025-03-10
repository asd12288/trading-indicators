import DocsLayout from "@/components/DocsLayout";
import { getDocsSections, getDocContent } from "@/lib/docs";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default async function DocsPage({
  params,
}: {
  params: { locale: string };
}) {
  // Load all document sections for the current locale
  const sections = await getDocsSections(params.locale);
  // Load the introduction document for the excerpt
  const introContent = await getDocContent('introduction', params.locale);
  
  return (
    <DocsLayout>
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Documentation
        </h1>
        
        <div className="prose mx-auto mb-12 max-w-3xl dark:prose-invert">
          {/* Introduction excerpt */}
          <div className="mb-10 rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 p-6 shadow-sm">
            <h2 className="flex items-center text-blue-800">
              <span className="mr-2">📚</span> {introContent.title}
            </h2>
            <div className="text-slate-700">
              {/* Show first paragraph of introduction */}
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: extractFirstParagraph(introContent.body) 
                }} 
              />
              <div className="mt-4 text-right">
                <Link 
                  href="/docs/introduction"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Read more
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Doc sections */}
          <h2>Documentation Sections</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {sections.map((section) => (
              <div 
                key={section.slug} 
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {section.title}
                </h3>
                <p className="mb-4 text-sm text-slate-500">
                  {section.description}
                </p>
                <Link 
                  href={`/docs/${section.slug}`}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Read documentation
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}

// Helper function to extract just the first paragraph for the intro excerpt
function extractFirstParagraph(html: string): string {
  const match = html.match(/<p>(.*?)<\/p>/);
  return match ? match[0] : '';
}