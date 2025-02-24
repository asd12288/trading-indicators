import SignalLayout from "@/components/SignalLayout";
import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";

export default async function Page({
  params,
}: {
  params: { id: string; locale: string };
}) {
  if (!params?.id) {
    console.error("No ID provided in URL params");
    redirect({ href: "/signals", locale: params.locale });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    console.error("Auth error or missing user ID:", userError);
    redirect({ href: "/login", locale: params.locale });
  }

  // Validate that we have both required parameters before rendering
  if (!params.id || !user.id) {
    console.error("Missing required parameters:", {
      signalId: params.id,
      userId: user.id,
    });
    redirect({ href: "/signals", locale: params.locale });
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
    <div>
      <SignalLayout id={params.id} userId={user.id} isPro={isPro} />
    </div>
  );
}
