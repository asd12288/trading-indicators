"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import supabaseClient from "@/database/supabase/supabase";
import { toast } from "@/hooks/use-toast";

interface TelegramAuthProps {
  userId: string;
  profile: { telegram_chat_id?: string };
}

const TelegramAuth = ({ userId, profile }: TelegramAuthProps) => {
  const [telegramActive, setTelegramActive] = useState(
    profile?.telegram_chat_id,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const TELEGRAM_BOT_USERNAME = "World_Trade_Signals_Bot";

  const handleTelegramConnect = () => {
    // Initialize audio on user interaction

    if (!userId) {
      console.error("No user ID available");
      return;
    }

    window.open(
      `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${userId}`,
      "_blank",
    );

    if (profile?.telegram_chat_id) {
      setTelegramActive(true);
    }
  };

  async function handleRemoveTelegram() {
    try {
      setIsLoaded(true);
      const { data, error } = await supabaseClient
        .from("profiles")
        .update({ telegram_chat_id: null })
        .eq("id", userId);

      toast({
        title: "success",
        description: "Telegram removed",
      });
      setTelegramActive(false);
    } catch (error) {
      console.error("Error removing Telegram", error);
      toast({
        title: "error",
        description: "Error removing Telegram",
      });
    } finally {
      setIsLoaded(false);
    }
  }

  return (
    <div className="mb-4 flex flex-col items-center space-y-4 text-center">
      <h2 className="text-2xl font-semibold">Telegram Notifications</h2>
      {!telegramActive ? (
        <>
          <Button
            onClick={handleTelegramConnect}
            className="rounded  px-4 py-2 "
          >
            Connect Telegram
          </Button>
          <p className="mt-2 text-sm text-gray-400">
            Click to open Telegram and start the bot. This will link your chat
            to your account.
          </p>
        </>
      ) : (
        <>
          <p className="text-green-600">Telegram connected</p>
          <Button
            onClick={handleRemoveTelegram}
            className="bg-red-900 hover:bg-red-950"
            disabled={isLoaded}
          >
            Remove Telegram
          </Button>
        </>
      )}
    </div>
  );
};

export default TelegramAuth;
