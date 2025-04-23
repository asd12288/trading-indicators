import SignalLayout from "@/components/SignalLayout";
import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  return {
    title: params ? `${params.id} - Signal Details` : "Trader Map",
  };
}

export default async function Page({
  params,
}: {
  params: { id: string; locale: string };
}) {
  // Check if we have instrument ID - early redirect if not
  if (!params?.id) {
    console.error("Missing instrument ID in URL params");
    redirect({ href: "/smart-alerts", locale: params.locale });
    return null;
  }

  const supabase = await createClient();

  // Get current user data
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Redirect to login if no user or error
  if (userError || !user?.id) {
    console.error("Authentication error or no user");
    redirect({ href: "/login", locale: params.locale });
    return null;
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  // Redirect if no profile found
  if (profileError || !profile) {
    console.error("No profile found for user ID:", user.id);
    redirect({ href: "/login", locale: params.locale });
    return null;
  }

  const isPro = profile?.plan === "pro";

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950">
      <SignalLayout id={params.id} userId={user.id} isPro={isPro} />
    </div>
  );
}
