import SignalsLayout from "@/components/SignalsLayout";
import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";
import { UserInitializer } from "@/providers/UserInitializer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Alerts",
};

async function page({ params }: { params: { locale: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale: params.locale });
  }

  // Get the user profile from Supabase to pass to client components
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  // Return the client component with server-fetched auth data
  return (
    <UserInitializer user={user} profile={profile}>
      <SignalsLayout />
    </UserInitializer>
  );
}

export default page;
