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
    title: params ? `${params.id}` : "Trader Map",
  };
}

export default async function Page({
  params,
}: {
  params: { id: string; locale: string };
}) {
  if (!params?.id) {
    redirect({ href: "/smart-alerts", locale: params.locale });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    redirect({ href: "/login", locale: params.locale });
  }

  // Validate that we have both required parameters before rendering
  if (!params.id || !user.id) {
    console.error("Missing required parameters:", {
      signalId: params.id,
      userId: user.id,
    });
    redirect({ href: "/smart-alerts", locale: params.locale });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    console.error("No profile found for user ID:", user.id);
    redirect({ href: "/login", locale: params.locale });
  }

  const isPro = profile?.plan === "pro" ? true : false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      <SignalLayout id={params.id} userId={user.id} isPro={isPro} />
    </div>
  );
}
