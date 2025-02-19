"use client";

import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "@/hooks/use-toast";
import usePreferences from "@/hooks/usePreferences";

interface SignalContextMenuProps {
  userId: string;
  children: React.ReactNode;
  instrumentName: string;
}

const SignalContextMenu = ({
  userId,
  children,
  instrumentName,
}: SignalContextMenuProps) => {
  const { preferences, updatePreference, isLoading } = usePreferences(userId);

  // Fallback default preferences if none exist yet
  const currentPrefs = preferences[instrumentName] || {
    notifications: false,
    volume: false,
    favorite: false,
  };

  const handleToggleNotifications = async () => {
    const newValue = !currentPrefs.notifications;
    toast({
      title: `Notifications ${newValue ? "enabled" : "disabled"}`,
      description: `Signal ${instrumentName} notifications are now ${newValue ? "enabled" : "disabled"}`,
    });
    await updatePreference(instrumentName, { notifications: newValue });
  };

  const handleToggleVolume = async () => {
    const newValue = !currentPrefs.volume;
    toast({
      title: `Volume ${newValue ? "enabled" : "disabled"}`,
      description: `Sound for signal ${instrumentName} is now ${newValue ? "enabled" : "disabled"}`,
    });
    await updatePreference(instrumentName, { volume: newValue });
  };

  const handleToggleFavorite = async () => {
    const newValue = !currentPrefs.favorite;
    toast({
      title: newValue ? `Added to favorites` : `Removed from favorites`,
      description: `Signal ${instrumentName} is now ${newValue ? "a favorite" : "removed from favorites"}.`,
    });
    await updatePreference(instrumentName, { favorite: newValue });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="bg-slate-800 text-slate-50">
        <ContextMenuItem onClick={handleToggleNotifications}>
          {currentPrefs.notifications
            ? "Disable Notifications"
            : "Enable Notifications"}
        </ContextMenuItem>
        <ContextMenuItem onClick={handleToggleVolume}>
          {currentPrefs.volume ? "Mute Volume" : "Enable Volume"}
        </ContextMenuItem>
        <ContextMenuItem onClick={handleToggleFavorite}>
          {currentPrefs.favorite ? "Remove from Favorites" : "Add to Favorites"}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default SignalContextMenu;
