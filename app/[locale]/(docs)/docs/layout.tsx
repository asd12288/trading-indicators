import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Get the best Smart Alerts for your trades",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-slate-50">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
