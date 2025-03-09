'use client'

import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { DocsSidebar } from './docs-sidebar';

interface AppSidebarProps {
  docSections?: Array<{
    slug: string;
    title: string;
    description: string;
  }>;
}

export function AppSidebar({ docSections = [] }: AppSidebarProps) {
  const t = useTranslations("SidebarDocs");
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  
  // Determine if we're in the docs section
  const isDocsSection = pathname.includes('/docs');
  
  if (isDocsSection) {
    return <DocsSidebar locale={locale} t={t} pathname={pathname} items={docSections} />;
  }
  
  // For now just return the docs sidebar for all sections
  return <DocsSidebar locale={locale} t={t} pathname={pathname} items={docSections} />;
}
