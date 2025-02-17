"use client";
import React from "react";
import { initializeAudio } from "@/lib/notification";

interface TelegramAuthProps {
  userId: string;
  profile: { telegram_chat_id?: string };
}

const TelegramAuth = ({ userId, profile }: TelegramAuthProps) => {
  const TELEGRAM_BOT_USERNAME = "World_Trade_Signals_Bot";

  const isTelegramConnected = profile?.telegram_chat_id;

  const handleTelegramConnect = () => {
    // Initialize audio on user interaction
    initializeAudio();

    if (!userId) {
      console.error("No user ID available");
      return;
    }

    window.open(
      `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${userId}`,
      "_blank",
    );
  };

  return (
    <div className="mb-4 flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-semibold">Telegram Notifications</h2>
      {!isTelegramConnected ? (
        <>
          <button
            onClick={handleTelegramConnect}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Connect Telegram
          </button>
          <p className="mt-2 text-sm text-gray-400">
            Click to open Telegram and start the bot. This will link your chat
            to your account.
          </p>
        </>
      ) : (
        <p className="text-green-600">Telegram connected</p>
      )}
    </div>
  );
};

export default TelegramAuth;
