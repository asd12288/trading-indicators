// filepath: /c:/Users/ilanc/Desktop/indicators/components/TelegramAuth.tsx
"use client";

import { useEffect, useState } from "react";
import supabaseClient from "@/database/supabase/supabase";

export default function TelegramAuth({ userId }: { userId: string }) {
  const [telegramChatId, setTelegramChatId] = useState("");

  useEffect(() => {
    // Attach the global callback function
    (window as any).onTelegramAuth = async (user: any) => {
      try {
        const chatId = user?.id?.toString() || "";
        if (chatId) {
          const { error } = await supabaseClient
            .from("profiles")
            .update({ telegram_chat_id: chatId })
            .eq("id", userId);

          if (error) {
            console.error("Error saving Telegram Chat ID:", error);
            alert("Failed to save Telegram Chat ID.");
          } else {
            setTelegramChatId(chatId);
            alert("Telegram connected successfully!");
          }
        } else {
          alert("Failed to authenticate with Telegram.");
        }
      } catch (err) {
        console.error("onTelegramAuth Error:", err);
      }
    };
  }, [userId]);

  return (
    <div>
      <h2>Connect Your Telegram</h2>
      {telegramChatId ? (
        <p>Your Telegram Chat ID: {telegramChatId}</p>
      ) : (
        // This div is the container for the Telegram login widget
        <div
          className="telegram-login"
          data-telegram-login="World_Trade_Signals_Bot"
          data-size="large"
          data-onauth="onTelegramAuth(user)"
          data-request-access="write"
        ></div>
      )}
    </div>
  );
}
