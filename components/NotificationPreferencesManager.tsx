"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import supabaseClient from "@/database/supabase/supabase";
import useSession from "@/hooks/useSession";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/**
 * Component for managing user notification preferences
 */
export default function NotificationPreferencesManager() {
  const t = useTranslations("NotificationPreferences");
  const { toast } = useToast();
  const { session } = useSession();
  const userId = session?.user?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    trading_signals: true,
    price_breakouts: true,
    volatility_alerts: true,
    pattern_alerts: true,
    economic_events: true,
    subscription_reminders: true,
    performance_milestones: true,
    risk_alerts: true,
  });

  const [allNotifications, setAllNotifications] = useState(true);
  const [tradingNotifications, setTradingNotifications] = useState(true);
  const [otherNotifications, setOtherNotifications] = useState(true);

  // Fetch user's notification preferences
  useEffect(() => {
    async function fetchPreferences() {
      if (!userId) return;

      try {
        setIsLoading(true);

        // Check if the user has preferences
        const { data, error } = await supabaseClient
          .from("notification_preferences")
          .select("*")
          .eq("user_id", userId)
          .single();

        // Log for debugging
        console.log("Notification preferences fetch:", { data, error });

        // Handle database errors or table not existing
        if (error) {
          console.error("Error fetching notification preferences:", error);
          // Don't get stuck in loading - use default preferences if there's an error
          setIsLoading(false);
          return;
        }

        // If we have data, use it for the preferences
        if (data) {
          setPreferences(data);

          // Set the group toggles based on the individual preferences
          const trading =
            data.trading_signals &&
            data.price_breakouts &&
            data.volatility_alerts &&
            data.pattern_alerts;

          const other =
            data.economic_events &&
            data.subscription_reminders &&
            data.performance_milestones &&
            data.risk_alerts;

          setTradingNotifications(trading);
          setOtherNotifications(other);
          setAllNotifications(trading && other);
        } else {
          // If no preferences found, create default ones - but don't wait for the result
          supabaseClient
            .from("notification_preferences")
            .insert({ user_id: userId })
            .then(({ error: insertError }) => {
              if (insertError) {
                console.error(
                  "Error creating default preferences:",
                  insertError,
                );
              }
            });
        }
      } catch (error) {
        console.error("Error in fetchPreferences:", error);
        // Don't get stuck in loading if there's an exception
      } finally {
        setIsLoading(false);
      }
    }

    fetchPreferences();
  }, [userId]);

  // Handle toggling all notifications
  const handleToggleAll = (checked: boolean) => {
    setAllNotifications(checked);
    setTradingNotifications(checked);
    setOtherNotifications(checked);

    setPreferences({
      trading_signals: checked,
      price_breakouts: checked,
      volatility_alerts: checked,
      pattern_alerts: checked,
      economic_events: checked,
      subscription_reminders: checked,
      performance_milestones: checked,
      risk_alerts: checked,
    });
  };

  // Handle toggling all trading notifications
  const handleToggleTrading = (checked: boolean) => {
    setTradingNotifications(checked);

    const newPreferences = {
      ...preferences,
      trading_signals: checked,
      price_breakouts: checked,
      volatility_alerts: checked,
      pattern_alerts: checked,
    };

    setPreferences(newPreferences);

    // Update "all" toggle if needed
    const otherAllChecked =
      preferences.economic_events &&
      preferences.subscription_reminders &&
      preferences.performance_milestones &&
      preferences.risk_alerts;

    setAllNotifications(checked && otherAllChecked);
  };

  // Handle toggling all other notifications
  const handleToggleOther = (checked: boolean) => {
    setOtherNotifications(checked);

    const newPreferences = {
      ...preferences,
      economic_events: checked,
      subscription_reminders: checked,
      performance_milestones: checked,
      risk_alerts: checked,
    };

    setPreferences(newPreferences);

    // Update "all" toggle if needed
    const tradingAllChecked =
      preferences.trading_signals &&
      preferences.price_breakouts &&
      preferences.volatility_alerts &&
      preferences.pattern_alerts;

    setAllNotifications(checked && tradingAllChecked);
  };

  // Handle toggling a specific notification type
  const handleTogglePreference = (key: string, checked: boolean) => {
    const newPreferences = { ...preferences, [key]: checked };
    setPreferences(newPreferences);

    // Update group toggles
    const tradingAllChecked =
      key === "trading_signals" ? checked : newPreferences.trading_signals;
    const priceAllChecked =
      key === "price_breakouts" ? checked : newPreferences.price_breakouts;
    const volatilityAllChecked =
      key === "volatility_alerts" ? checked : newPreferences.volatility_alerts;
    const patternAllChecked =
      key === "pattern_alerts" ? checked : newPreferences.pattern_alerts;

    const economicAllChecked =
      key === "economic_events" ? checked : newPreferences.economic_events;
    const subscriptionAllChecked =
      key === "subscription_reminders"
        ? checked
        : newPreferences.subscription_reminders;
    const performanceAllChecked =
      key === "performance_milestones"
        ? checked
        : newPreferences.performance_milestones;
    const riskAllChecked =
      key === "risk_alerts" ? checked : newPreferences.risk_alerts;

    const newTradingAll =
      tradingAllChecked &&
      priceAllChecked &&
      volatilityAllChecked &&
      patternAllChecked;
    const newOtherAll =
      economicAllChecked &&
      subscriptionAllChecked &&
      performanceAllChecked &&
      riskAllChecked;

    setTradingNotifications(newTradingAll);
    setOtherNotifications(newOtherAll);
    setAllNotifications(newTradingAll && newOtherAll);
  };

  // Save preferences to database
  const savePreferences = async () => {
    if (!userId) return;

    try {
      setIsSaving(true);

      const { error } = await supabaseClient
        .from("notification_preferences")
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Error saving preferences:", error);
        toast({
          title: t("saveError"),
          description: t("saveErrorMessage"),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t("saveSuccess"),
        description: t("saveSuccessMessage"),
      });
    } catch (error) {
      console.error("Error in savePreferences:", error);
      toast({
        title: t("saveError"),
        description: t("saveErrorMessage"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border border-slate-700 bg-slate-800/30">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100">{t("title")}</CardTitle>
        <CardDescription className="text-slate-400">
          {t("description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main toggle for all notifications */}
        <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <div className="space-y-0.5">
            <Label className="text-base text-slate-200">
              {t("allNotifications")}
            </Label>
          </div>
          <Switch
            checked={allNotifications}
            onCheckedChange={handleToggleAll}
          />
        </div>

        <Separator className="bg-slate-700" />

        {/* Trading notifications section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium text-slate-200">
              {t("tradingNotifications")}
            </Label>
            <Switch
              checked={tradingNotifications}
              onCheckedChange={handleToggleTrading}
            />
          </div>

          <div className="ml-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="trading_signals"
                checked={preferences.trading_signals}
                onCheckedChange={(checked) =>
                  handleTogglePreference("trading_signals", checked)
                }
                disabled={!tradingNotifications}
              />
              <Label
                htmlFor="trading_signals"
                className={
                  !tradingNotifications ? "text-slate-500" : "text-slate-300"
                }
              >
                {t("tradingSignals")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="price_breakouts"
                checked={preferences.price_breakouts}
                onCheckedChange={(checked) =>
                  handleTogglePreference("price_breakouts", checked)
                }
                disabled={!tradingNotifications}
              />
              <Label
                htmlFor="price_breakouts"
                className={
                  !tradingNotifications ? "text-slate-500" : "text-slate-300"
                }
              >
                {t("priceBreakouts")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="volatility_alerts"
                checked={preferences.volatility_alerts}
                onCheckedChange={(checked) =>
                  handleTogglePreference("volatility_alerts", checked)
                }
                disabled={!tradingNotifications}
              />
              <Label
                htmlFor="volatility_alerts"
                className={
                  !tradingNotifications ? "text-slate-500" : "text-slate-300"
                }
              >
                {t("volatilityAlerts")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="pattern_alerts"
                checked={preferences.pattern_alerts}
                onCheckedChange={(checked) =>
                  handleTogglePreference("pattern_alerts", checked)
                }
                disabled={!tradingNotifications}
              />
              <Label
                htmlFor="pattern_alerts"
                className={
                  !tradingNotifications ? "text-slate-500" : "text-slate-300"
                }
              >
                {t("patternAlerts")}
              </Label>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        {/* Other notifications section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium text-slate-200">
              {t("otherNotifications")}
            </Label>
            <Switch
              checked={otherNotifications}
              onCheckedChange={handleToggleOther}
            />
          </div>

          <div className="ml-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="economic_events"
                checked={preferences.economic_events}
                onCheckedChange={(checked) =>
                  handleTogglePreference("economic_events", checked)
                }
                disabled={!otherNotifications}
              />
              <Label
                htmlFor="economic_events"
                className={
                  !otherNotifications ? "text-slate-500" : "text-slate-300"
                }
              >
                {t("economicEvents")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="subscription_reminders"
                checked={preferences.subscription_reminders}
                onCheckedChange={(checked) =>
                  handleTogglePreference("subscription_reminders", checked)
                }
                disabled={!otherNotifications}
              />
              <Label
                htmlFor="subscription_reminders"
                className={
                  !otherNotifications ? "text-slate-500" : "text-slate-300"
                }
              >
                {t("subscriptionReminders")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="performance_milestones"
                checked={preferences.performance_milestones}
                onCheckedChange={(checked) =>
                  handleTogglePreference("performance_milestones", checked)
                }
                disabled={!otherNotifications}
              />
              <Label
                htmlFor="performance_milestones"
                className={
                  !otherNotifications ? "text-slate-500" : "text-slate-300"
                }
              >
                {t("performanceMilestones")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="risk_alerts"
                checked={preferences.risk_alerts}
                onCheckedChange={(checked) =>
                  handleTogglePreference("risk_alerts", checked)
                }
                disabled={!otherNotifications}
              />
              <Label
                htmlFor="risk_alerts"
                className={
                  !otherNotifications ? "text-slate-500" : "text-slate-300"
                }
              >
                {t("riskAlerts")}
              </Label>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={savePreferences}
          disabled={isSaving}
        >
          {isSaving ? t("saving") : t("saveChanges")}
        </Button>
      </CardFooter>
    </Card>
  );
}
