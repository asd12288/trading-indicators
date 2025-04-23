"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/providers/UserProvider";
import { createClient } from "@/database/supabase/client";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";

/**
 * NotificationPreferencesManager
 * This component allows users to manage their notification preferences by instrument
 */
export default function NotificationPreferencesManager() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [instruments, setInstruments] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<
    Record<string, { notifications: boolean; volume: boolean }>
  >({});
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch instruments and user preferences
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const supabase = createClient();

        // Get distinct instrument names
        const { data: instrumentsData, error: instrumentsError } =
          await supabase
            .from("all_signals")
            .select("instrument_name")
            .not("instrument_name", "is", null)
            .order("instrument_name");

        if (instrumentsError) {
          console.error("Error fetching instruments:", instrumentsError);
          return;
        }

        // Get user preferences
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select("preferences")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user preferences:", profileError);
        }

        // Extract unique instruments
        const uniqueInstruments = [
          ...new Set(instrumentsData.map((i) => i.instrument_name)),
        ];
        setInstruments(uniqueInstruments);

        // Set preferences, initialize missing ones
        const userPrefs = userProfile?.preferences || {};
        const initializedPrefs: Record<
          string,
          { notifications: boolean; volume: boolean }
        > = {};

        uniqueInstruments.forEach((instrument) => {
          initializedPrefs[instrument] = {
            notifications: userPrefs[instrument]?.notifications || false,
            volume: userPrefs[instrument]?.volume || false,
          };
        });

        setPreferences(initializedPrefs);
      } catch (err) {
        console.error("Error loading preference data:", err);
        toast({
          title: "Error",
          description: "Failed to load notification preferences",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Save preferences to database
  const savePreferences = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("profiles")
        .update({ preferences })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated",
        variant: "success",
      });
    } catch (err) {
      console.error("Error saving preferences:", err);
      toast({
        title: "Error",
        description: "Failed to save your preferences",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Toggle notification preference for an instrument
  const toggleNotification = (instrument: string) => {
    setPreferences((prev) => ({
      ...prev,
      [instrument]: {
        ...prev[instrument],
        notifications: !prev[instrument].notifications,
      },
    }));
  };

  // Filter instruments based on active tab
  const filteredInstruments =
    activeTab === "all"
      ? instruments
      : activeTab === "enabled"
        ? instruments.filter((i) => preferences[i]?.notifications)
        : instruments.filter((i) => !preferences[i]?.notifications);

  // Count enabled notifications
  const enabledCount = instruments.filter(
    (i) => preferences[i]?.notifications,
  ).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Loading your preferences...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Choose which instruments you want to receive notifications for
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            {enabledCount} enabled
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Instruments</TabsTrigger>
            <TabsTrigger value="enabled">Enabled</TabsTrigger>
            <TabsTrigger value="disabled">Disabled</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            {filteredInstruments.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center justify-center py-6 text-center">
                <BellOff className="mb-2 h-12 w-12 opacity-50" />
                <p>No instruments found in this category</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredInstruments.map((instrument) => (
                  <div
                    key={instrument}
                    className="flex items-center justify-between rounded-lg border p-3 shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      {preferences[instrument]?.notifications ? (
                        <Bell className="text-primary h-5 w-5" />
                      ) : (
                        <BellOff className="text-muted-foreground h-5 w-5" />
                      )}
                      <span className="font-medium">{instrument}</span>
                    </div>
                    <Switch
                      checked={preferences[instrument]?.notifications || false}
                      onCheckedChange={() => toggleNotification(instrument)}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={savePreferences} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
