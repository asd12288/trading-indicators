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
    profile?.telegram_chat_id,
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const t = useTranslations("TelegramAuth");

  const TELEGRAM_BOT_USERNAME = "World_Trade_Signals_Bot";

  const handleTelegramConnect = () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "No user ID available",
        variant: "destructive",
      });
      return;
    }

    window.open(
      `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${userId}`,
      "_blank",
    );

    // Poll for telegram_chat_id updates
    const checkInterval = setInterval(async () => {
      const { data } = await supabaseClient
        .from("profiles")
        .select("telegram_chat_id")
        .eq("id", userId)
        .single();

      if (data?.telegram_chat_id) {
        setTelegramActive(true);
        clearInterval(checkInterval);
        toast({
          title: "Success",
          description: t("success"),
        });
      }
    }, 2000);

    // Clear interval after 2 minutes
    setTimeout(() => clearInterval(checkInterval), 120000);
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
