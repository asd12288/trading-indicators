import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "../LanguageSwitcher";
import { Button } from "./button";
import { getDocsSections } from "@/lib/docs";

interface DocsSidebarProps {
  locale: string;
  t: any;
  pathname: string;
  items: Array<{
    slug: string;
    title: string;
    description: string;
  }>;
}

export function DocsSidebar({ locale, t, pathname, items }: DocsSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent className="flex h-full flex-col border-r border-r-slate-800 bg-slate-900 text-slate-50">
        <SidebarHeader className="border-b border-slate-800 p-6 text-2xl font-bold">
          <Link href="/" className="transition-colors hover:text-blue-400">
            Trader Map
          </Link>
        </SidebarHeader>
        <SidebarMenu className="flex-grow">
          {items.map((item) => {
            const isActive = pathname.includes(`/docs/${item.slug}`);
            return (
              <SidebarMenuItem key={item.slug}>
                <Link passHref legacyBehavior href={`/docs/${item.slug}`}>
                  <SidebarMenuButton
                    className={`py-3 pl-6 transition-all ${
                      isActive
                        ? "border-l-4 border-blue-500 bg-blue-900/30 text-blue-300"
                        : "border-l-4 border-transparent hover:bg-slate-800 hover:text-slate-50"
                    }`}
                  >
                    {item.title}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
        <SidebarFooter className="space-y-4 border-t border-slate-800 p-6">
          <LanguageSwitcher className="mb-4" />
          <Link href={"/"}>
            <Button className="mb-4 w-full bg-blue-600 hover:bg-blue-700">
              {t("button")}
            </Button>
          </Link>
          <p className="text-center text-xs text-slate-400">
            © 2025 Trader Map
          </p>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
