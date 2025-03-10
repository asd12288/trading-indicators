import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { getDocsSections } from "@/lib/docs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Get the best Smart Alerts for your trades",
};

export default async function Layout({ 
  children, 
  params 
}: { 
  children: React.ReactNode;
  params: { locale: string }
}) {
  // Fetch docs sections on the server
  const sections = await getDocsSections(params.locale);
  
  return (
    <SidebarProvider>
      <AppSidebar docSections={sections} />
      <main className="flex min-h-screen w-full flex-col bg-slate-50 text-slate-950">
        <div className="sticky top-0 z-10 flex h-14 items-center border-b border-slate-200 bg-white px-4">
          <SidebarTrigger className="mr-4 md:hidden" />
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            {/* Search can be added here later */}
          </div>
        </div>
        <div className="flex-1 p-6 md:p-8 lg:px-10">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}