"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import supabaseClient from "@/database/supabase/supabase";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Check, Link, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface TelegramAuthProps {
  userId: string;
  profile: { telegram_chat_id?: string };
}

const TelegramAuth = ({ userId, profile }: TelegramAuthProps) => {
  const [telegramActive, setTelegramActive] = useState(
    Boolean(profile.telegram_chat_id),
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const t = useTranslations("TelegramAuth");

  const TELEGRAM_BOT_USERNAME = "World_Trade_Signals_Bot";

  const handleTelegramConnect = async () => {
    if (!userId) {
      console.error("handleTelegramConnect: No userId provided");
      toast.error('"Error: No userId provided");');
      return;
    }

    console.log(
      "handleTelegramConnect: Opening Telegram URL for userId:",
      userId,
    );
    window.open(
      `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${userId}`,
      "_blank",
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
        console.log(
          "Polling success: telegram_chat_id updated:",
          data.telegram_chat_id,
        );
        clearInterval(pollInterval);
        setTelegramActive(true);
        toast.success(
          "Telegram connected successfully! You will now receive alerts.",
        );
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
    console.log(
      "handleRemoveTelegram: Attempting to remove Telegram connection for user:",
      userId,
    );
    try {
      setIsLoaded(true);
      const { data, error } = await supabaseClient
        .from("profiles")
        .update({ telegram_chat_id: null })
        .eq("id", userId);

      if (error) {
        toast.error("Error removing Telegram: " + error.message);
      } else {
        console.log(
          "handleRemoveTelegram: Successfully removed telegram_chat_id:",
          data,
        );
        toast.success(
          "Telegram disconnected successfully! You will no longer receive alerts.",
        );
        setTelegramActive(false);
      }
    } catch (error) {
      console.error("handleRemoveTelegram: Exception occurred:", error);
      toast.error(
        "An error occurred while disconnecting Telegram. Please try again.",
      );
    } finally {
      setIsLoaded(false);
    }
  }

  return (
    <Card className="border-slate-700 bg-slate-800/90 shadow-md">
      <CardHeader className="border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <Badge className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-slate-100">{t("title")}</CardTitle>
        </div>
        <CardDescription className="text-slate-300">
          {telegramActive
            ? t("activeDescription") ||
              "Receive real-time alerts directly in your Telegram app"
            : t("description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-6">
          {!telegramActive ? (
            <>
              <div className="relative w-full rounded-lg bg-slate-700/50 p-5">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20">
                      <Badge className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Connect to our Telegram Bot
                      </p>
                      <p className="text-xs text-slate-400">
                        @{TELEGRAM_BOT_USERNAME}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md border border-slate-700 bg-slate-800 p-3">
                    <div className="text-xs text-slate-300">
                      <p>1. Click the connect button below</p>
                      <p>2. Open the Telegram app</p>
                      <p>3. Start the bot and follow the instructions</p>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleTelegramConnect}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Link className="h-4 w-4" />
                  {t("cta")}
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600/20">
                  <Check className="h-7 w-7 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-100">
                    Telegram Connected
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Your account is successfully connected to Telegram
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-green-700 bg-green-900/30 text-green-300"
                >
                  Active
                </Badge>
              </div>
            </>
          )}
        </div>
      </CardContent>

      {telegramActive && (
        <CardFooter className="border-t border-slate-700/50 pt-4">
          <Button
            onClick={handleRemoveTelegram}
            className="flex w-full items-center gap-2 bg-red-900/70 text-white hover:bg-red-900"
            disabled={isLoaded}
            variant="destructive"
          >
            <X className="h-4 w-4" />
            {isLoaded ? "Disconnecting..." : t("remove")}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TelegramAuth;
