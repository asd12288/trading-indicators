"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import usePreferences from "@/hooks/usePreferences";
import { toast } from "sonner";
import supabaseClient from "@/database/supabase/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaHeart, FaBell, FaVolumeUp } from "react-icons/fa";
import { LuLoader } from "react-icons/lu";

type SignalInfo = {
  instrument_name: string;
  display_name?: string;
  category?: string;
  active?: boolean;
};

// Define a component to show when signals are loading
const LoadingState = () => (
  <div className="flex h-48 w-full items-center justify-center">
    <LuLoader className="mr-2 h-8 w-8 animate-spin text-blue-400" />
    <span className="text-lg text-slate-300">Loading preferences...</span>
  </div>
);

// Define a component to show when no signals are found
const NoSignalsState = () => (
  <div className="flex h-48 w-full flex-col items-center justify-center">
    <div className="text-2xl font-semibold text-slate-400">No signals available</div>
    <p className="mt-2 text-slate-500">
      You haven't interacted with any signals yet.
    </p>
  </div>
);

export default function NotificationPreferences({ userId }: { userId: string }) {
  const t = useTranslations("Notifications");
  const [signals, setSignals] = useState<SignalInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  
  // Get user preferences using the hook
  const { 
    preferences, 
    updatePreference, 
    isLoading: prefsLoading
  } = usePreferences(userId);

  // Load available signals
  useEffect(() => {
    const fetchSignals = async () => {
      setIsLoading(true);
      try {
        // First attempt to get from the all_signals table
        const { data: uniqueInstruments, error } = await supabaseClient
          .from("all_signals")
          .select("instrument_name")
          .order("instrument_name");

        if (error) throw error;
        
        // Process the raw instrument data into the format we need
        const processedSignals = (uniqueInstruments || [])
          .reduce((unique: SignalInfo[], item) => {
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignals();
  }, []);

  // Get unique categories for filtering
  const categories = [...new Set(signals.map((s) => s.category))].sort();

  // Filter signals based on search query and category
  const filteredSignals = signals.filter((signal) => {
    const matchesSearch = searchQuery === "" || 
      signal.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      signal.instrument_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filterCategory || signal.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle preference toggle
  const handleToggle = async (instrumentName: string, prefType: 'notifications' | 'volume' | 'favorite', value: boolean) => {
    try {
      await updatePreference(instrumentName, { [prefType]: value });
    } catch (err) {
      console.error(`Failed to update ${prefType} for ${instrumentName}:`, err);
      toast.error(`Failed to update preference`);
    }
  };

  if (isLoading || prefsLoading) {
    return <LoadingState />;
  }

  if (!signals.length) {
    return <NoSignalsState />;
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-white">Notification Preferences</h2>
        <p className="text-slate-400">
          Manage your notification settings for each signal
        </p>
      </div>

      {/* Search and filter controls */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search signals..."
          className="h-9 rounded-md bg-slate-800 px-3 text-sm text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select
          className="h-9 rounded-md bg-slate-800 px-3 text-sm text-white"
          value={filterCategory || ""}
          onChange={(e) => setFilterCategory(e.target.value || null)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Signal preferences table */}
      <div className="rounded-lg border border-slate-700 shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-800/50 hover:bg-slate-800/70">
              <TableHead className="w-1/3 text-slate-300">Signal</TableHead>
              <TableHead className="w-1/5 text-center text-slate-300">Category</TableHead>
              <TableHead className="w-[120px] text-center text-slate-300">
                <FaBell className="mx-auto h-4 w-4" title="Notifications" />
              </TableHead>
              <TableHead className="w-[120px] text-center text-slate-300">
                <FaVolumeUp className="mx-auto h-4 w-4" title="Sound Alerts" />
              </TableHead>
              <TableHead className="w-[120px] text-center text-slate-300">
                <FaHeart className="mx-auto h-4 w-4" title="Favorites" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSignals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No signals match your search
                </TableCell>
              </TableRow>
            ) : (
              filteredSignals.map((signal) => {
                const prefs = preferences[signal.instrument_name] || {
                  notifications: false,
                  volume: false,
                  favorite: false
                };
                
                return (
                  <TableRow 
                    key={signal.instrument_name} 
                    className={cn(
                      "transition-colors hover:bg-slate-800/40",
                      !signal.active && "opacity-60"
                    )}
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-slate-200">{signal.display_name}</span>
                        <span className="text-xs text-slate-500">{signal.instrument_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-slate-400">
                      {signal.category || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={prefs.notifications}
                        onCheckedChange={(checked) => 
                          handleToggle(signal.instrument_name, 'notifications', checked)
                        }
                        disabled={!signal.active}
                        className="mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={prefs.volume}
                        onCheckedChange={(checked) => 
                          handleToggle(signal.instrument_name, 'volume', checked)
                        }
                        disabled={!signal.active}
                        className="mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={prefs.favorite}
                        onCheckedChange={(checked) => 
                          handleToggle(signal.instrument_name, 'favorite', checked)
                        }
                        disabled={!signal.active}
                        className="mx-auto"
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          className="text-slate-300 hover:bg-slate-800 hover:text-white"
          onClick={() => {
            toast.success("Preferences are saved automatically");
          }}
        >
          Settings are saved automatically
        </Button>
      </div>
    </div>
  );
}