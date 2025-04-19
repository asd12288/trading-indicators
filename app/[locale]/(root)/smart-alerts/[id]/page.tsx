import SignalLayout from "@/components/SignalLayout";
import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";
import { Metadata } from "next";
import { ClientThemeProvider } from "@/components/ui/client-theme-provider";
import { cn } from "@/lib/utils";
import { NotificationService } from "@/lib/notification-service";

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

  // Check if this is the first time viewing this signal
  const { data: viewHistory } = await supabase
    .from("signal_views")
    .select("*")
    .eq("user_id", user.id)
    .eq("signal_id", params.id)
    .single();

  // Get signal details
  const { data: signalData } = await supabase
    .from("signals")
    .select("*")
    .eq("id", params.id)
    .single();

  // If first time viewing or no view in last 24 hours, record the view
  if (!viewHistory) {
    await supabase.from("signal_views").insert({
      user_id: user.id,
      signal_id: params.id,
      viewed_at: new Date().toISOString(),
    });

    // Send relevant notifications only if this is a new signal viewing
    if (signalData) {
      // If signal has high potential (MFE > 50), notify user
      if (signalData.mfe && signalData.mfe > 50) {
        await NotificationService.notifyHighPotentialSignal(
          user.id,
          params.id,
          signalData.mfe,
        );
      }

      // For non-pro users, suggest upgrade when viewing high-value signals
      if (!profile.plan || profile.plan !== "pro") {
        // Only trigger this for certain high-value signals to avoid spamming
        if (signalData.priority === "high") {
          await NotificationService.notifyProFeature(
            user.id,
            "Advanced Signal Analysis",
          );
        }
      }
    }
  }

  const isPro = profile?.plan === "pro" ? true : false;

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950">
      <SignalLayout id={params.id} userId={user.id} isPro={isPro} />
    </div>
  );
}
