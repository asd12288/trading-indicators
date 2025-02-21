import SignalLayout from "@/components/SignalLayout";
import { createClient } from "@/database/supabase/server";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  if (!params?.id) {
    console.error("No ID provided in URL params");
    redirect("/signals");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    console.error("Auth error or missing user ID:", userError);
    redirect("/login");
  }

  // Validate that we have both required parameters before rendering
  if (!params.id || !user.id) {
    console.error("Missing required parameters:", {
      signalId: params.id,
      userId: user.id,
    });
    redirect("/signals");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    console.error("No profile found for user ID:", user.id);
    redirect("/login");
  }

  const isPro = profile?.role === "pro" ? true : false;

  return (
    <div>
      <SignalLayout id={params.id} userId={user.id} isPro={isPro} />
    </div>
  );
}
