"use client";

import { useEffect, useState } from "react";
import supabaseClient from "@/database/supabase/supabase";
import Script from "next/script";

export default function TelegramAuth({ userId }: { userId: string }) {
  const [telegramChatId, setTelegramChatId] = useState("");

  useEffect(() => {
    // Attach the callback function to window
    (window as any).onTelegramAuth = async (user: any) => {
      try {
        // user object contains info like { id, first_name, username, ... }
        const chatId = user?.id?.toString() || "";

        // Save the chatId in your database
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
        <>
          <p>Use the Telegram button above to authenticate.</p>
        </>
      )}
    </div>
  );
}
