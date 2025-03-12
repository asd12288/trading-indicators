import { Metadata } from "next";
import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

// Export metadata (only allowed in server components)
export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPage({
  params,
}: {
  params: { locale: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.id) {
    return redirect({ href: "/login", locale: params.locale });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin" ? true : false;

  if (!isAdmin) {
    return redirect("/");
  }

  const { data: users } = await supabase.from("profiles").select("*");
  const { data: signals } = await supabase
    .from("all_signals")
    .select("*")
    .order("entry_time", { ascending: false });
  const { data: posts } = await supabase.from("blogs").select("*");

  // Pass fetched data to client component
  return <AdminDashboardClient users={users} signals={signals} posts={posts} />;
}
