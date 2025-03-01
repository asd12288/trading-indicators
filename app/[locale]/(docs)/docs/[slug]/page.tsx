import { getDocContent } from "@/lib/docs";
import DocsLayout from "@/components/DocsLayout";

export default async function DocPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const content = getDocContent(params.slug, params.locale);

  return (
    <DocsLayout>
      <article className="prose dark:prose-invert">
        <h1>{content.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content.body }} />
      </article>
    </DocsLayout>
  );
}
