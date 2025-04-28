"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { Bell, Volume2, Star, Search } from "lucide-react";
import usePreferences from "@/hooks/usePreferences";
import useSignals from "@/hooks/useSignals";
import { PreferenceValues } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Signal } from "@/lib/types";

interface NotificationPreferencesProps {
  userId?: string;
}

const NotificationPreferences = ({ userId }: NotificationPreferencesProps) => {
  const t = useTranslations("NotificationPreferences");
  const { preferences, isLoading, error, updatePreference } =
    usePreferences(userId);

  const { signals } = useSignals();
  const [filteredSignals, setFilteredSignals] = useState<Signal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Fixed page size to 10
  const [totalItems, setTotalItems] = useState(0);

  // Manage signals and preferences
  useEffect(() => {
    if (!signals || !preferences) return;

    // Get all signals that have preferences or match search query
    const signalsWithPrefs = signals.filter((signal) => {
      const name = signal.instrument_name?.toLowerCase() || "";
      const matchesSearch = name.includes(searchQuery.toLowerCase());
      const hasPreferences = preferences[signal.instrument_name];
      return searchQuery ? matchesSearch : hasPreferences;
    });

    // Update total count for pagination
    setTotalItems(signalsWithPrefs.length);

    // Apply pagination
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setFilteredSignals(signalsWithPrefs.slice(start, end));
  }, [signals, preferences, searchQuery, currentPage]);

  // Handle preference toggle
  const handleTogglePreference = async (
    signalId: string,
    preferenceType: keyof PreferenceValues,
  ) => {
    if (!preferences[signalId]) {
      // Initialize preferences if they don't exist
      await updatePreference(signalId, {
        notifications: preferenceType === "notifications",
        volume: preferenceType === "volume",
        favorite: preferenceType === "favorite",
      });
    } else {
      // Toggle the specific preference
      const currentValue = preferences[signalId][preferenceType] || false;
      await updatePreference(signalId, {
        [preferenceType]: !currentValue,
      });
    }
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">
          {t("title") || "Signal Preferences"}
        </h2>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder") || "Search signals..."}
            value={searchQuery}
            onChange={handleSearch}
            className="pl-9 text-slate-200"
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800/60">
        <Table className="w-full">
          <TableHeader className="bg-slate-800">
            <TableRow>
              <TableHead className="w-[50%] text-slate-300">
                {t("signal") || "Signal"}
              </TableHead>
              <TableHead className="w-[16.67%] text-center text-slate-300">
                {t("favorite") || "Favorite"}
              </TableHead>
              <TableHead className="w-[16.67%] text-center text-slate-300">
                {t("notifications") || "Notifications"}
              </TableHead>
              <TableHead className="w-[16.67%] text-center text-slate-300">
                {t("sound") || "Sound"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSignals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-slate-400"
                >
                  {searchQuery
                    ? t("noSearchResults") || "No signals match your search"
                    : t("noSignals") || "No signals with preferences"}
                </TableCell>
              </TableRow>
            ) : (
              filteredSignals.map((signal) => {
                const signalId = signal.instrument_name;
                const signalPrefs = preferences[signalId] || {
                  notifications: false,
                  volume: false,
                  favorite: false,
                };

                return (
                  <TableRow key={signalId} className="hover:bg-slate-700/30">
                    <TableCell className="font-medium text-slate-200">
                      <Link
                        href={`/smart-alerts/${signalId}`}
                        className="hover:text-blue-400 hover:underline"
                      >
                        {signalId}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch
                          checked={signalPrefs.favorite || false}
                          onCheckedChange={() =>
                            handleTogglePreference(signalId, "favorite")
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch
                          checked={signalPrefs.notifications || false}
                          onCheckedChange={() =>
                            handleTogglePreference(signalId, "notifications")
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch
                          checked={signalPrefs.volume || false}
                          onCheckedChange={() =>
                            handleTogglePreference(signalId, "volume")
                          }
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

      {/* Pagination UI - simplified without rows per page selector */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">
              {t("previousPage") || "Previous page"}
            </span>
          </Button>

          <span className="px-2 text-sm text-slate-400">
            {t("pageXofY", {
              current: currentPage,
              total: totalPages,
            }) || `Page ${currentPage} of ${totalPages}`}
          </span>

          <Button
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">{t("nextPage") || "Next page"}</span>
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg border border-slate-700 bg-slate-800/60 p-4">
        <div className="flex items-center space-x-2">
          <Star className="h-4 w-4 text-amber-500" />
          <span className="text-sm text-slate-300">
            {t("legendFavorite") || "Favorite signals appear on dashboard"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Bell className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-slate-300">
            {t("legendNotifications") || "Enable browser notifications"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-green-500" />
          <span className="text-sm text-slate-300">
            {t("legendSound") || "Enable sound alerts"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
