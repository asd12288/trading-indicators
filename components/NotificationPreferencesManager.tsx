"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Bell, Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import supabaseClient from "@/database/supabase/supabase";
import { useUser } from "@/providers/UserProvider";
import { toast } from "@/hooks/use-toast";

export default function NotificationPreferencesManager() {
  const { user } = useUser();
  const [preferences, setPreferences] = useState({
    email: true,
    pushNotifications: true,
    soundAlerts: true,
    marketUpdates: true,
    priceAlerts: true,
    systemAnnouncements: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const loadPreferences = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabaseClient
          .from("notification_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setPreferences({
            email: data.email_notifications ?? true,
            pushNotifications: data.push_notifications ?? true,
            soundAlerts: data.sound_alerts ?? true,
            marketUpdates: data.market_updates ?? true,
            priceAlerts: data.price_alerts ?? true,
            systemAnnouncements: data.system_announcements ?? true,
          });
        }
      } catch (error) {
        console.error("Error loading notification preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user?.id]);

  const savePreferences = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const { error } = await supabaseClient
        .from("notification_preferences")
        .upsert(
          {
            user_id: user.id,
            email_notifications: preferences.email,
            push_notifications: preferences.pushNotifications,
            sound_alerts: preferences.soundAlerts,
            market_updates: preferences.marketUpdates,
            price_alerts: preferences.priceAlerts,
            system_announcements: preferences.systemAnnouncements,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );

      if (error) throw error;

      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated",
      });
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div>Please log in to manage notification preferences</div>;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Loading preferences...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 text-white shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-400" />
          <CardTitle>Notification Preferences</CardTitle>
        </div>
        <CardDescription className="text-slate-300">
          Customize how you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="email-notifications"
                className="text-base font-medium"
              >
                Email Notifications
              </Label>
              <p className="text-sm text-slate-400">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.email}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, email: checked })
              }
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="push-notifications"
                className="text-base font-medium"
              >
                Push Notifications
              </Label>
              <p className="text-sm text-slate-400">
                Receive notifications on your devices
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences.pushNotifications}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, pushNotifications: checked })
              }
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 space-y-0.5">
              <Volume2 className="h-4 w-4 text-slate-400" />
              <Label htmlFor="sound-alerts" className="text-base font-medium">
                Sound Alerts
              </Label>
            </div>
            <Switch
              id="sound-alerts"
              checked={preferences.soundAlerts}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, soundAlerts: checked })
              }
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </div>

        <div className="pt-2">
          <h3 className="mb-3 text-lg font-medium">Notification Types</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="market-updates" className="text-base">
                Market Updates
              </Label>
              <Switch
                id="market-updates"
                checked={preferences.marketUpdates}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, marketUpdates: checked })
                }
                className="data-[state=checked]:bg-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="price-alerts" className="text-base">
                Price Alerts
              </Label>
              <Switch
                id="price-alerts"
                checked={preferences.priceAlerts}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, priceAlerts: checked })
                }
                className="data-[state=checked]:bg-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="system-announcements" className="text-base">
                System Announcements
              </Label>
              <Switch
                id="system-announcements"
                checked={preferences.systemAnnouncements}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    systemAnnouncements: checked,
                  })
                }
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={savePreferences}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}
