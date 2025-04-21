"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/providers/UserProvider";
import usePreferences from "@/hooks/usePreferences";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bell, Volume2, Star, SearchIcon, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function UserPreferencesTable() {
  const { user } = useUser();
  const {
    preferences,
    isLoading,
    updatePreference,
    favorites,
    volumeOn,
    notificationsOn,
  } = usePreferences(user?.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [instruments, setInstruments] = useState<string[]>([]);

  // Handle instruments with preferences
  useEffect(() => {
    if (!isLoading) {
      // Get all unique instrument names from preferences
      const allInstruments = Object.keys(preferences);
      setInstruments(allInstruments);
    }
  }, [preferences, isLoading]);

  // Update a specific preference
  const handleToggle = async (
    instrumentName: string,
    field: keyof (typeof preferences)[string],
    currentValue: boolean,
  ) => {
    try {
      await updatePreference(instrumentName, { [field]: !currentValue });

      // Show success toast
      const status = !currentValue ? "enabled" : "disabled";
      const iconMap = {
        notifications: (
          <Bell className={!currentValue ? "text-blue-500" : "text-gray-500"} />
        ),
        volume: (
          <Volume2
            className={!currentValue ? "text-blue-500" : "text-gray-500"}
          />
        ),
        favorite: (
          <Star
            className={!currentValue ? "text-amber-500" : "text-gray-500"}
          />
        ),
      };

      const labelMap = {
        notifications: "Notifications",
        volume: "Sound alerts",
        favorite: "Favorites",
      };

      toast({
        title: `${labelMap[field]} ${status}`,
        description: `${field === "favorite" ? "Added to" : ""} ${labelMap[field]} ${status} for ${instrumentName}`,
        variant: !currentValue ? "default" : "destructive",
        icon: iconMap[field],
      });
    } catch (error) {
      // Handle error
      toast({
        title: "Error",
        description: `Failed to update ${field} preference`,
        variant: "destructive",
      });
    }
  };

  // Filter instruments based on search query
  const filteredInstruments = instruments.filter((instrument) =>
    instrument.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <Card className="border-slate-700 bg-slate-800/90">
        <CardHeader className="border-b border-slate-700/50">
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            Loading preferences...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <p className="text-slate-400">
            Loading your instrument preferences...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-700 bg-slate-800/90 shadow-lg">
      <CardHeader className="border-b border-slate-700/50">
        <CardTitle className="flex items-center justify-between text-slate-100">
          <span>Instrument Preferences</span>
          <div className="relative w-64">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search instrument..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-slate-700 bg-slate-800 pl-8 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {instruments.length === 0 ? (
          <div className="bg-slate-850/50 rounded-md p-8 text-center text-slate-400">
            <p>No instruments with preferences found.</p>
            <p className="mt-2 text-sm">
              When you set notifications, sound alerts, or favorites for
              instruments, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border border-slate-700">
            <Table>
              <TableCaption className="text-slate-400">
                Manage all your instrument preferences in one place
              </TableCaption>
              <TableHeader className="bg-slate-700">
                <TableRow className="border-slate-600">
                  <TableHead className="font-medium text-slate-200">
                    Instrument
                  </TableHead>
                  <TableHead className="text-center font-medium text-slate-200">
                    Notifications
                  </TableHead>
                  <TableHead className="text-center font-medium text-slate-200">
                    Sound Alerts
                  </TableHead>
                  <TableHead className="text-center font-medium text-slate-200">
                    Favorite
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-slate-800/50">
                {filteredInstruments.length === 0 ? (
                  <TableRow className="border-slate-700 hover:bg-slate-700/50">
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-slate-400"
                    >
                      No instruments matching "{searchQuery}" found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInstruments.map((instrumentName) => {
                    const prefs = preferences[instrumentName] || {
                      notifications: false,
                      volume: false,
                      favorite: false,
                    };

                    return (
                      <TableRow
                        key={instrumentName}
                        className="border-slate-700 hover:bg-slate-700/50"
                      >
                        <TableCell className="font-medium text-slate-200">
                          {instrumentName}
                          {prefs.favorite && (
                            <Badge
                              className="ml-2 bg-amber-600 text-xs"
                              variant="default"
                            >
                              Favorite
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center text-slate-300">
                          <div className="flex justify-center">
                            <Switch
                              checked={prefs.notifications}
                              onCheckedChange={() =>
                                handleToggle(
                                  instrumentName,
                                  "notifications",
                                  prefs.notifications,
                                )
                              }
                              className={cn("data-[state=checked]:bg-blue-600")}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-slate-300">
                          <div className="flex justify-center">
                            <Switch
                              checked={prefs.volume}
                              onCheckedChange={() =>
                                handleToggle(
                                  instrumentName,
                                  "volume",
                                  prefs.volume,
                                )
                              }
                              className="data-[state=checked]:bg-green-600"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-slate-300">
                          <div className="flex justify-center">
                            <Switch
                              checked={prefs.favorite}
                              onCheckedChange={() =>
                                handleToggle(
                                  instrumentName,
                                  "favorite",
                                  prefs.favorite,
                                )
                              }
                              className="data-[state=checked]:bg-amber-600"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
