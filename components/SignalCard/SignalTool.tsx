"use client";

import { IoIosNotifications, IoIosNotificationsOff } from "react-icons/io";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface SignalToolProps {
  signalId: string;
  userId: string;
  defaultPrefs: {
    notifications: boolean;
    volume: boolean;
    favorite: boolean;
  };
}

function SignalTool({ signalId, userId, defaultPrefs }: SignalToolProps) {
  const [notifications, setNotifications] = useState(
    defaultPrefs.notifications,
  );
  const [volume, setVolume] = useState(defaultPrefs.volume);
  const [favorite, setFavorite] = useState(defaultPrefs.favorite);

  async function updatePreferences(
    notificationsValue: boolean,
    volumeValue: boolean,
    favoriteValue: boolean,
  ) {
    try {
      await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          signalId,
          notifications: notificationsValue,
          volume: volumeValue,
          favorite: favoriteValue,
        }),
      });
    } catch (err) {
      console.error("Error updating preferences:", err);
    }
  }

  function handleNotifications() {
    const newNotificationsValue = !notifications;
    setNotifications(newNotificationsValue);
    updatePreferences(newNotificationsValue, volume, favorite);
    toast({
      title: newNotificationsValue
        ? "Notifications Enabled"
        : "Notifications Disabled",
      description: newNotificationsValue
        ? `You will now receive notifications for ${signalId} `
        : `You will no longer receive notifications for ${signalId}`,
    });
  }

  function handleVolume() {
    const newVolumeValue = !volume;
    setVolume(newVolumeValue);
    updatePreferences(notifications, newVolumeValue, favorite);
    toast({
      title: newVolumeValue
        ? `Volume Enabled for ${signalId}`
        : `Volume Disabled ${signalId}`,
      description: newVolumeValue
        ? `You will now receive volume for ${signalId}`
        : `You will no longer receive volume for ${signalId}`,
    });
  }

  function handleFavorite() {
    const newFavoriteValue = !favorite;
    setFavorite(newFavoriteValue);
    updatePreferences(notifications, volume, newFavoriteValue);
    toast({
      title: newFavoriteValue
        ? `${signalId} Added to Favorites`
        : `${signalId} Removed from Favorites`,
    });
  }

  return (
    <div className="flex items-center space-x-4 border-l-2 pl-4">
      <h4 className="text-xl font-medium">Signal Settings:</h4>
      {notifications ? (
        <IoIosNotifications
          className="text-4xl"
          onClick={handleNotifications}
        />
      ) : (
        <IoIosNotificationsOff
          className="text-4xl"
          onClick={handleNotifications}
        />
      )}
      {volume ? (
        <FaVolumeUp className="text-4xl" onClick={handleVolume} />
      ) : (
        <FaVolumeMute className="text-4xl" onClick={handleVolume} />
      )}
      {favorite ? (
        <MdFavorite className="text-4xl" onClick={handleFavorite} />
      ) : (
        <MdFavoriteBorder className="text-4xl" onClick={handleFavorite} />
      )}
    </div>
  );
}

export default SignalTool;
