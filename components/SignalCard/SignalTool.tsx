"use client";

import { IoIosNotifications, IoIosNotificationsOff } from "react-icons/io";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import React from "react";
import { toast } from "@/hooks/use-toast";
import usePreferences from "@/hooks/usePreferences";
import SignalToolTooltip from "./SignalToolTooltip";
import { useTranslations } from "next-intl";

interface SignalToolProps {
  signalId: string;
  userId: string;
  text?: "regular" | "small";
  isPro?: boolean;
}

function SignalTool({ signalId, userId, isPro = true }: SignalToolProps) {
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
    toast({
      title: t(`notifications.${status}`),
      description: t("notifications.description", { signalId, status }),
    });
    await updatePreference(signalId, { notifications: newValue });
  }

  async function handleVolume() {
    const newValue = !volume;
    const status = newValue ? "enabled" : "disabled";
    toast({
      title: t(`volume.${status}`),
      description: t("volume.description", { signalId, status }),
    });
    await updatePreference(signalId, { volume: newValue });
  }

  async function handleFavorite() {
    const newValue = !favorite;
    const status = newValue ? "added" : "removed";
    toast({
      title: t(`favorite.${status}`),
      description: t("favorite.description", {
        signalId,
        status: status,
      }),
    });
    await updatePreference(signalId, { favorite: newValue });
  }

  return (
    <div className="flex items-center space-x-4 border-l-2 pl-4">
      {!isLoading && (
        <>
          <SignalToolTooltip text={t("notifications.tooltip")}>
            <button onClick={handleNotifications} disabled={!isPro}>
              {notifications ? (
                <IoIosNotifications
                  className={`${!isPro ? "text-4xl text-slate-700" : "text-4xl"}`}
                />
              ) : (
                <IoIosNotificationsOff
                  className={`${!isPro ? "text-4xl text-slate-700" : "text-4xl"}`}
                />
              )}
            </button>
          </SignalToolTooltip>

          <SignalToolTooltip text={t("volume.tooltip")}>
            <button onClick={handleVolume} disabled={!isPro}>
              {volume ? (
                <FaVolumeUp
                  className={`${!isPro ? "text-4xl text-slate-700" : "text-4xl"}`}
                />
              ) : (
                <FaVolumeMute
                  className={`${!isPro ? "text-4xl text-slate-700" : "text-4xl"}`}
                />
              )}
            </button>
          </SignalToolTooltip>

          <SignalToolTooltip text={t("favorite.tooltip")}>
            <button onClick={handleFavorite} disabled={!isPro}>
              {favorite ? (
                <MdFavorite
                  className={`${!isPro ? "text-4xl text-slate-700" : "text-4xl"}`}
                />
              ) : (
                <MdFavoriteBorder
                  className={`${!isPro ? "text-4xl text-slate-700" : "text-4xl"}`}
                />
              )}
            </button>
          </SignalToolTooltip>
        </>
      )}
      {isLoading && <div></div>}
    </div>
  );
}

export default SignalTool;
