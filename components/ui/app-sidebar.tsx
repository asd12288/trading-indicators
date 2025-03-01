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

const items = [
  {
    title: "Getting Started",
    url: "/docs/getting-started",
  },
  {
    title: "introduction",
    url: "/docs/introduction",
  },
];

export function AppSidebar() {
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
        <LanguageSwitcher />
      </SidebarContent>
    </Sidebar>
  );
}
