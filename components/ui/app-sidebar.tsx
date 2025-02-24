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
import Link from "next/link";

const items = [
  {
    title: "Getting Started",
    url: "/docs/getting-started",
  },
  {
    title: "signal-card",
    url: "/docs/signal-card",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-slate-900 text-slate-50">
        <SidebarHeader>Docs</SidebarHeader>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="hover:bg-slate-800 hover:text-slate-50"
                asChild
              >
                <Link href={item.url}>{item.title}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
