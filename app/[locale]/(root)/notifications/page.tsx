"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@/providers/UserProvider";
import useNotification from "@/hooks/useNotification";
import {
  CheckCircle,
  Trash2,
  Loader2,
  AlertCircle,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Define filter types for notifications
type FilterType =
  | "all"
  | "unread"
  | "read"
  | "trade"
  | "news"
  | "system"
  | "alert"
  | "signal";

export default function NotificationsPage() {
  const { user } = useUser();
  const userId = user?.id || "";

  const {
    notification: notifications,
    loading,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotification(userId);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Derived state
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Handle filtering
  const getFilteredNotifications = () => {
    let filtered = [...notifications];

    // Apply type filter
    if (activeFilter === "unread")
      filtered = filtered.filter((n) => !n.is_read);
    else if (activeFilter === "read")
      filtered = filtered.filter((n) => n.is_read);
    else if (activeFilter !== "all")
      filtered = filtered.filter((n) => n.type === activeFilter);

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title?.toLowerCase().includes(query) ||
          n.body?.toLowerCase().includes(query),
      );
    }

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  // Format notification date
  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Get background color based on notification type
  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "trade":
        return "bg-emerald-900/20 text-emerald-400";
      case "news":
        return "bg-blue-900/20 text-blue-400";
      case "system":
        return "bg-purple-900/20 text-purple-400";
      case "alert":
        return "bg-amber-900/20 text-amber-400";
      case "signal":
        return "bg-cyan-900/20 text-cyan-400";
      default:
        return "bg-slate-700/30 text-slate-400";
    }
  };

  // Handler to mark a notification as read
  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  // Get notification type label
  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case "trade":
        return "Trade";
      case "news":
        return "News";
      case "system":
        return "System";
      case "alert":
        return "Alert";
      case "signal":
        return "Signal";
      default:
        return type;
    }
  };

  // Handler for clear all confirmation
  const handleClearAllConfirm = () => {
    setShowConfirmClear(true);
  };

  // Handler to clear all notifications
  const handleClearAll = async () => {
    await clearNotifications();
    setShowConfirmClear(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            Notifications
          </h1>
          <p className="mt-1 text-slate-400">
            {notifications.length}{" "}
            {notifications.length === 1 ? "notification" : "notifications"},{" "}
            {unreadCount} unread
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="flex items-center gap-1.5 rounded-md border border-slate-700/50 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-700"
            >
              <CheckCircle className="h-4 w-4" />
              Mark all as read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAllConfirm}
              className="flex items-center gap-1.5 rounded-md border border-red-900/30 bg-red-950/20 px-3 py-1.5 text-sm font-medium text-red-300 transition-colors hover:border-red-800/50 hover:bg-red-900/30"
            >
              <Trash2 className="h-4 w-4" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Search and filters row */}
      <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-700/50 bg-slate-800/30 p-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-slate-700 bg-slate-800 pl-9 pr-4 text-sm text-white placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden text-sm text-slate-400 sm:inline-block">
            <Filter className="mr-1 inline h-3.5 w-3.5" /> Filter:
          </span>

          {(
            [
              "all",
              "unread",
              "read",
              "trade",
              "news",
              "system",
              "alert",
              "signal",
            ] as FilterType[]
          ).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                activeFilter === filter
                  ? "bg-blue-900/40 text-blue-300"
                  : "bg-slate-700/30 text-slate-300 hover:bg-slate-700/70",
              )}
            >
              {filter === "all"
                ? "All"
                : filter === "unread"
                  ? "Unread"
                  : filter === "read"
                    ? "Read"
                    : getNotificationTypeLabel(filter)}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications list */}
      <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="mb-2 h-10 w-10 animate-spin text-slate-400" />
              <p className="text-slate-400">Loading notifications...</p>
            </div>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <ul className="divide-y divide-slate-700/30">
            {filteredNotifications.map((notif) => (
              <motion.li
                key={notif.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "group relative flex items-start gap-4 p-4 transition-colors md:p-6",
                  notif.is_read
                    ? "bg-transparent hover:bg-slate-700/20"
                    : "bg-slate-700/10 hover:bg-slate-700/30",
                )}
              >
                {/* Type indicator */}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    getNotificationTypeColor(notif.type),
                  )}
                >
                  <span className="text-xs font-semibold uppercase">
                    {notif.type?.slice(0, 1)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3
                      className={cn(
                        "font-medium",
                        notif.is_read ? "text-slate-300" : "text-white",
                      )}
                    >
                      {notif.title}
                    </h3>
                    {!notif.is_read && (
                      <span className="inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>

                  {(notif.body || (notif as any).message) && (
                    <p className="text-sm text-slate-400">
                      {notif.body || (notif as any).message}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatNotificationDate(notif.created_at)}
                    </span>
                    <span className="rounded-full bg-slate-700/40 px-2 py-0.5">
                      {getNotificationTypeLabel(notif.type)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1 self-start">
                  {!notif.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                      title="Mark as read"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center">
            <AlertCircle className="mb-2 h-10 w-10 text-slate-500 opacity-40" />
            <p className="text-slate-400">
              {searchQuery || activeFilter !== "all"
                ? "No notifications match your filters"
                : "You don't have any notifications yet"}
            </p>
          </div>
        )}
      </div>

      {/* Clear All Confirmation Dialog */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-xl"
          >
            <h2 className="text-xl font-semibold text-white">
              Clear all notifications?
            </h2>
            <p className="mt-2 text-slate-400">
              This will delete all your notifications. This action cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
