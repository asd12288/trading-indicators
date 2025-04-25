"use client";

import { useEffect } from 'react';
import { VolumeX, Volume2 } from 'lucide-react';
import { toast } from "sonner";
import usePreferences from "@/hooks/usePreferences";
import SoundService from "@/lib/services/soundService";

interface MuteButtonProps {
  userId?: string;
  className?: string;
}

export default function MuteButton({ userId, className = "" }: MuteButtonProps) {
  const { globalMute, updateGlobalMute, isLoading } = usePreferences(userId);

  // Sync the sound service with the preference when it loads
  useEffect(() => {
    if (!isLoading) {
      SoundService.setGlobalMute(globalMute);
    }
  }, [globalMute, isLoading]);

  const toggleMute = async () => {
    try {
      const newMuteState = !globalMute;
      
      // Update the SoundService first for immediate effect
      SoundService.setGlobalMute(newMuteState);
      
      // Then persist to database
      await updateGlobalMute(newMuteState);
      
      // Show feedback toast
      toast.success(
        newMuteState
          ? "All sounds muted. You won't hear notification sounds."
          : "Sounds enabled. You'll now hear notification sounds."
      );
    } catch (err) {
      console.error("Failed to update mute preference:", err);
      toast.error("Failed to update sound preference");
      
      // Revert SoundService state on error
      SoundService.setGlobalMute(globalMute);
    }
  };

  // Don't render for anonymous users
  if (!userId) return null;

  return (
    <button
      onClick={toggleMute}
      className={`flex items-center justify-center rounded-md p-2 text-slate-300 hover:bg-slate-800/50 hover:text-white ${className}`}
      title={globalMute ? "Unmute notifications" : "Mute all notifications"}
    >
      {globalMute ? (
        <VolumeX size={18} />
      ) : (
        <Volume2 size={18} />
      )}
    </button>
  );
}