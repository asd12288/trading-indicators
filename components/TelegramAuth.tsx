"use client";
import React from "react";

const TelegramAuth = ({ userId }) => {
  // Replace with your actual Bot username from BotFather
  const TELEGRAM_BOT_USERNAME = "World_Trade_Signals_Bot";

  const handleTelegramConnect = () => {
    // This link opens Telegram chat with your bot, passing the user’s ID to /start
    window.open(
      `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${userId}`,
      "_blank",
    );
  };

  return (
    <div className="mb-4 flex flex-col items-center">
      <button
        onClick={handleTelegramConnect}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Connect Telegram
      </button>
      <p className="mt-2 text-sm text-gray-400">
        Click to open Telegram and start the bot. This will link your chat to
        your account.
      </p>
    </div>
  );
};

export default TelegramAuth;
