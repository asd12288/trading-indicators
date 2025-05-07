"use client";

import { useTheme } from "@/context/theme-context";
import usePreferences from "@/hooks/usePreferences";
import { cn } from "@/lib/utils";
import { BellIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { IoIosNotifications, IoIosNotificationsOff } from "react-icons/io";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { toast } from "sonner";
import SignalToolTooltip from "./SignalToolTooltip";

interface SignalToolProps {
  signalId: string;
  userId: string;
  text?: "regular" | "small";
  isPro?: boolean;
}

function SignalTool({ signalId, userId, isPro = true }: SignalToolProps) {
  const { theme } = useTheme();
  const { preferences, updatePreference, isLoading } = usePreferences(userId);
  const t = useTranslations("SignalTool");

  const currentPrefs = preferences[signalId] || {
    notifications: false,
    volume: false,
    favorite: false,
  };

  const { notifications, volume, favorite } = currentPrefs;

  async function handleNotifications() {
    const newValue = !notifications;
    const status = newValue ? "enabled" : "disabled";

    // Enhanced toast with icon
    toast.success(`Notifications have been ${status} for ${signalId}`);

    try {
      await updatePreference(signalId, { notifications: newValue });
      // Success toast
      if (newValue) {
        toast.success(
          `You'll now receive notifications when ${signalId} trades start or finish`,
        );
      }
    } catch (error) {
      toast.error("Failed to update notification preferences");
    }
  }

  async function handleVolume() {
    const newValue = !volume;
    const status = newValue ? "enabled" : "disabled";

    toast.success(`You've ${status} volume for ${signalId}`);

    try {
      await updatePreference(signalId, { volume: newValue });
    } catch (error) {
      toast.error("Failed to update volume preferences");
    }
  }

  async function handleFavorite() {
    const newValue = !favorite;
    const status = newValue ? "added" : "removed";

    // Enhanced toast with icon
    toast.success(`Signal ${signalId} has been ${status} to your favorites`);

    try {
      await updatePreference(signalId, { favorite: newValue });
    } catch (error) {
      toast.error("Failed to update favorite preferences");
    }
  }

  const buttonClasses = cn(
    "relative rounded-full p-2.5 transition-all duration-200",
    isPro
      ? theme === "dark"
        ? "hover:bg-slate-700/70 active:scale-95"
        : "hover:bg-slate-100 active:scale-95"
      : theme === "dark"
        ? "text-slate-700 cursor-not-allowed"
        : "text-slate-300 cursor-not-allowed",
  );

  const iconClasses = `text-2xl ${isPro ? "" : "opacity-50"}`;

  return (
    <div
      className={cn(
        "flex items-center space-x-3 border-l pl-4",
        theme === "dark" ? "border-slate-700/70" : "border-slate-200",
      )}
    >
      {!isLoading && (
        <>
          {/* <SignalToolTooltip text={t("notifications.tooltip")}>
            <button
              onClick={handleNotifications}
              disabled={!isPro}
              className={buttonClasses}
            >
              {notifications ? (
                <IoIosNotifications className={iconClasses} />
              ) : (
                <IoIosNotificationsOff className={iconClasses} />
              )}
              {!isPro && (
                <span
                  className={cn(
                    "absolute inset-0 rounded-full border",
                    theme === "dark"
                      ? "border-slate-700/50"
                      : "border-slate-200",
                  )}
                ></span>
              )}
            </button>
          </SignalToolTooltip>

          <SignalToolTooltip text={t("volume.tooltip")}>
            <button
              onClick={handleVolume}
              disabled={!isPro}
              className={buttonClasses}
            >
              {volume ? (
                <FaVolumeUp className={iconClasses} />
              ) : (
                <FaVolumeMute className={iconClasses} />
              )}
              {!isPro && (
                <span
                  className={cn(
                    "absolute inset-0 rounded-full border",
                    theme === "dark"
                      ? "border-slate-700/50"
                      : "border-slate-200",
                  )}
                ></span>
              )}
            </button>
          </SignalToolTooltip> */}

          <SignalToolTooltip text={t("favorite.tooltip")}>
            <button
              onClick={handleFavorite}
              disabled={!isPro}
              className={buttonClasses}
            >
              {favorite ? (
                <MdFavorite
                  className={`${iconClasses} ${
                    favorite ? "text-rose-500" : ""
                  }`}
                />
              ) : (
                <MdFavoriteBorder className={iconClasses} />
              )}
              {!isPro && (
                <span
                  className={cn(
                    "absolute inset-0 rounded-full border",
                    theme === "dark"
                      ? "border-slate-700/50"
                      : "border-slate-200",
                  )}
                ></span>
              )}
            </button>
          </SignalToolTooltip>
        </>
      )}
      {isLoading && (
        <div
          className={cn(
            "h-8 w-24 animate-pulse rounded-full",
            theme === "dark" ? "bg-slate-700/50" : "bg-slate-200/70",
          )}
        ></div>
      )}
    </div>
  );
}

export default SignalTool;
