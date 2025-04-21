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

  // Check if this is the first time viewing this signal
  const { data: viewHistory } = await supabase
    .from("signal_views")
    .select("*")
    .eq("user_id", user.id)
    .eq("signal_id", params.id)
    .single();

  // Record the view if first time (not using await to not block rendering)
  if (!viewHistory) {
    try {
      // Use RPC function to insert signal view and return signal data
      const { data: signalData } = await supabase.rpc(
        "record_signal_view_and_get_signal",
        {
          p_user_id: user.id,
          p_signal_id: params.id,
        },
      );

      // Only send notifications if we actually have signal data
      if (signalData && Object.keys(signalData).length > 0) {
        // If signal has high potential (MFE > 50), notify user
        if (signalData.mfe && signalData.mfe > 50) {
          NotificationService.notifyNewSignal(
            user.id,
            params.id,
            signalData.trade_side || "unknown",
            signalData.entry_price,
          ).catch((e) => console.error("Failed to send notification:", e));
        }

        // For non-pro users, suggest upgrade when viewing high-value signals
        if (!profile.plan || profile.plan !== "pro") {
          // Only trigger this for certain high-value signals to avoid spamming
          if (signalData.priority === "high") {
            NotificationService.notifySystem(
              user.id,
              "Unlock Advanced Features",
              "Upgrade to PRO to access advanced signal analysis tools",
            ).catch((e) =>
              console.error("Failed to send upgrade notification:", e),
            );
          }
        }
      }
    } catch (error) {
      console.error("Error recording view:", error);
      // Non-blocking error - continue showing the page
    }
  }

  const isPro = profile?.plan === "pro";

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950">
      <SignalLayout id={params.id} userId={user.id} isPro={isPro} />
    </div>
  );
}
