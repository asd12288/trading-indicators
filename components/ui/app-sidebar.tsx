import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "../LanguageSwitcher";
import { Button } from "./button";
import { useTranslations } from "next-intl";

const items = [
  {
    title: "Getting Started",
    url: "/docs/getting-started",
  },
  {
    title: "introduction",
    url: "/docs/introduction",
  },
  {
    title: "Smart Alert",
    url: "/docs/smart-alert",
  },
];

export function AppSidebar() {

  const t = useTranslations("SidebarDocs");



  return (
    <Sidebar>
      <SidebarContent className="border-r-slate-800 bg-slate-900 text-slate-50">
        <SidebarHeader className="p-6 text-2xl font-bold">
          <Link href={"/"}>Trader Map</Link>
        </SidebarHeader>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link passHref legacyBehavior href={item.url}>
                <SidebarMenuButton className="pl-6 hover:bg-slate-700 hover:text-slate-50">
                  {item.title}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarFooter className="p-6 text-xs text-slate-400">
          <LanguageSwitcher />
          <Link href={"/"}>
            <Button>{t('button')}</Button>
          </Link>
          <p>© 2025 Trader Map</p>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
