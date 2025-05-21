import { useState } from "react";
import { useTranslations } from "next-intl";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Loader2, Mail, Bell, Check } from "lucide-react";
import supabaseClient from "@/database/supabase/client";
import { toast } from "sonner";

interface NotificationSettingsProps {
  userId: string;
  initialSettings: {
    email_notification?: boolean;
  };
}

const NotificationSettings = ({
  userId,
  initialSettings,
}: NotificationSettingsProps) => {
  const t = useTranslations("NotificationSettings");
  const [emailNotifications, setEmailNotifications] = useState<boolean>(
    initialSettings?.email_notification ?? false,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = async () => {
    if (!userId) return;

    try {
      setIsSaving(true);
      setSaveSuccess(false);

      const { error } = await supabaseClient
        .from("profiles")
        .update({
          email_notification: emailNotifications,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      toast.success(
        t("saveSuccess", {
          fallback: "Notification settings updated successfully!",
        }),
      );
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast.error(
        t("saveError", { fallback: "Failed to update notification settings" }),
      );
    } finally {
      setIsSaving(false);
      // Reset success indicator after 2 seconds
      if (saveSuccess) {
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800/30 p-6">
        <h2 className="mb-6 text-center text-xl font-medium text-slate-100 sm:text-2xl">
          {t("title", { fallback: "Notification Settings" })}
        </h2>

        <div className="mb-8 rounded-md border border-slate-700 bg-slate-900/50 p-4">
          <p className="mb-4 text-center text-sm text-slate-300">
            {t("description", {
              fallback:
                "Configure how and when you'd like to receive notifications about trading signals and account updates.",
            })}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-800/30 p-2">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-slate-200">
                  {t("emailNotifications", { fallback: "Email Notifications" })}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {t("emailDescription", {
                    fallback: "Receive trading signal alerts via email",
                  })}
                </p>
              </div>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              aria-label="Toggle email notifications"
            />
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="gap-2 px-8"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("saving", { fallback: "Saving..." })}
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  {t("saved", { fallback: "Saved!" })}
                </>
              ) : (
                t("saveButton", { fallback: "Save Settings" })
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
