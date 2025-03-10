import Breadcrumb from "@/components/Breadcrumb";
import DocsLayout from "@/components/DocsLayout";
import TableOfContents from "@/components/TableOfContents";
import { getDocContent, extractHeadings } from "@/lib/docs";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "@/i18n/routing";

export default async function DocPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  // 1. Get document content from the markdown file
  const content = await getDocContent(params.slug, params.locale);
  
  // 2. Extract headings for the table of contents - now with await
  const headings = await extractHeadings(content.body);

  return (
    <DocsLayout>
      {/* Breadcrumb navigation */}
      <div className="mb-6">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link href="/docs">Docs</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator>
            <ChevronRightIcon className="h-4 w-4" />
          </Breadcrumb.Separator>
          <Breadcrumb.Item>{content.title}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 xl:grid-cols-4">
        {/* Main content column */}
        <article className="prose max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-blue-600 prose-code:rounded prose-code:bg-slate-100 prose-code:p-1 prose-code:text-slate-800 lg:col-span-2 xl:col-span-3">
          <h1>{content.title}</h1>
          {/* 3. Render the HTML content */}
          <div dangerouslySetInnerHTML={{ __html: content.body }} />
          
          {/* Previous/Next navigation */}
          <div className="mt-16 border-t border-slate-200 pt-8">
            <div className="flex justify-between">
              <div>
                {content.prevDoc && (
                  <Link
                    href={`/docs/${content.prevDoc.slug}`}
                    className="flex flex-col"
                  >
                    <span className="text-sm text-slate-500">Previous</span>
                    <span className="font-medium text-blue-600">
                      {content.prevDoc.title}
                    </span>
                  </Link>
                )}
              </div>
              <div>
                {content.nextDoc && (
                  <Link
                    href={`/docs/${content.nextDoc.slug}`}
                    className="flex flex-col"
                  >
                    <span className="text-sm text-slate-500">Next</span>
                    <span className="font-medium text-blue-600">
                      {content.nextDoc.title}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </article>
        
        {/* Table of contents sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            {/* 4. Display table of contents based on extracted headings */}
            <TableOfContents headings={headings} />
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}