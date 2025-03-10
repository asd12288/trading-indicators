'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/routing";
import LanguageSwitcher from "../LanguageSwitcher";
import { Button } from "./button";
import { useTranslations } from "next-intl";

export function AppSidebar() {
  const t = useTranslations("SidebarDocs");
  const pathname = usePathname();

  // Move items inside component to access translations
  const items = [
    {
      title: t("items.gettingStarted"),
      url: "/docs/getting-started",
    },
    {
      title: t("items.introduction"),
      url: "/docs/introduction",
    },
    {
      title: t("items.smartAlert"),
      url: "/docs/smart-alert",
    },
    {
      title: t("items.traderMap"),
      url: "/docs/mfe-mae-trading",
    },
  ];

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
            const isActive = pathname.startsWith(item.url);
            return (
              <SidebarMenuItem key={item.url}>
                <Link passHref legacyBehavior href={item.url}>
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
