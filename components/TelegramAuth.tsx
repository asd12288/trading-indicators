"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import supabaseClient from "@/database/supabase/supabase";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

interface TelegramAuthProps {
  userId: string;
  profile: { telegram_chat_id?: string };
}

const TelegramAuth = ({ userId, profile }: TelegramAuthProps) => {
  const [telegramActive, setTelegramActive] = useState(
    Boolean(profile.telegram_chat_id)
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const t = useTranslations("TelegramAuth");

  const TELEGRAM_BOT_USERNAME = "World_Trade_Signals_Bot";

  const handleTelegramConnect = async () => {
    if (!userId) {
      console.error("handleTelegramConnect: No userId provided");
      toast({
        title: "Error",
        description: "No user ID available",
        variant: "destructive",
      });
      return;
    }

    console.log("handleTelegramConnect: Opening Telegram URL for userId:", userId);
    window.open(
      `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${userId}`,
      "_blank"
    );

    // Start polling for telegram_chat_id updates every 2 seconds
    const pollInterval = setInterval(async () => {
      


      const { data, error } = await supabaseClient
        .from("profiles")
        .select("telegram_chat_id")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Polling error:", error);
      } else if (data?.telegram_chat_id) {
        console.log("Polling success: telegram_chat_id updated:", data.telegram_chat_id);
        clearInterval(pollInterval);
        setTelegramActive(true);
        toast({
          title: "Success",
          description: t("success"),
        });
      } else {
        console.log("Polling: telegram_chat_id not yet updated");
      }
    }, 2000);

    // Clear polling after 2 minutes if no update is detected
    setTimeout(() => {
      console.log("Polling timeout reached, clearing interval");
      clearInterval(pollInterval);
    }, 120000);
  };

  async function handleRemoveTelegram() {
    console.log("handleRemoveTelegram: Attempting to remove Telegram connection for user:", userId);
    try {
      setIsLoaded(true);
      const { data, error } = await supabaseClient
        .from("profiles")
        .update({ telegram_chat_id: null })
        .eq("id", userId);

      if (error) {
        console.error("handleRemoveTelegram: Error updating profile", error);
        toast({
          title: "Error",
          description: "Error removing Telegram",
        });
      } else {
        console.log("handleRemoveTelegram: Successfully removed telegram_chat_id:", data);
        toast({
          title: "Success",
          description: "Telegram removed",
        });
        setTelegramActive(false);
      }
    } catch (error) {
      console.error("handleRemoveTelegram: Exception occurred:", error);
      toast({
        title: "Error",
        description: "Error removing Telegram",
      });
    } finally {
      setIsLoaded(false);
    }
  }

  return (
    <div className="mb-4 flex flex-col items-center space-y-4 text-center">
      <h2 className="text-2xl font-semibold">{t("title")}</h2>
      {!telegramActive ? (
        <>
          <Button onClick={handleTelegramConnect} className="rounded px-4 py-2">
            {t("cta")}
          </Button>
          <p className="mt-2 text-sm text-gray-400">{t("description")}</p>
        </>
      ) : (
        <>
          <p className="text-green-600">{t("success")}</p>
          <Button
            onClick={handleRemoveTelegram}
            className="bg-red-900 hover:bg-red-950"
            disabled={isLoaded}
          >
            {t("remove")}
          </Button>
        </>
      )}
    </div>
  );
};

export default TelegramAuth;
