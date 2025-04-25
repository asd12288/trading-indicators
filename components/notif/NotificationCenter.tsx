"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  AlertCircle,
  LockOpen,
  Lock,
  BarChart3,
  Newspaper,
  Info,
} from "lucide-react";
import useSignalNotification from "../../hooks/useSignalNotification";
import useNotification from "../../hooks/useNotification";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import SoundService from "@/lib/services/soundService";

interface NotificationCenterProps {
  userId: string;
}

const NotificationCenter = ({ userId }: NotificationCenterProps) => {
  // subscribe to realtime signal notifications (handles all users)
  useSignalNotification();
  const {
    notification,
    loading,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotification(userId);
  const [open, setOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Count unread notifications
  const unreadCount = notification.filter((n) => !n.is_read).length;

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setConfirmClear(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle marking a notification as read
  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  // Handle notification click with URL redirection
  const handleNotificationClick = async (notif: any) => {
    if (notif.url) {
      // Mark as read first
      await markAsRead(notif.id);

      // Close dropdown
      setOpen(false);

      // Navigate: external in new tab, internal via router
      if (/^https?:\/\//.test(notif.url)) {
        window.open(notif.url, "_blank");
      } else {
        router.push(notif.url);
      }
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  // Handle clearing all notifications
  const handleClearAll = async () => {
    await clearNotifications();
    setConfirmClear(false);
  };

  // Get notification icon based on type and content
  const getNotificationIcon = (notif: any) => {
    // For signal notifications
    if (notif.type === "signal") {
      // Check if it's a trade open or close
      if (
        notif.title?.toLowerCase().includes("trade opened") ||
        notif.body?.toLowerCase().includes("entry")
      ) {
        return <LockOpen className="h-5 w-5" />;
      } else if (
        notif.title?.toLowerCase().includes("trade closed") ||
        notif.body?.toLowerCase().includes("exit")
      ) {
        return <Lock className="h-5 w-5" />;
      }
      return <BarChart3 className="h-5 w-5 text-blue-500" />;
    }
    // For news notifications
    else if (notif.type === "news") {
      return <Newspaper className="h-5 w-5 text-yellow-500" />;
    }
    // Default icon for other types
    return <Info className="h-5 w-5 text-slate-400" />;
  };

  // Format notification time
  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          SoundService.initializeAudio();
          setOpen(!open);
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-md border border-slate-700/40 bg-slate-800/90 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50 mt-2 w-80 min-w-80 max-w-sm origin-top-right overflow-hidden rounded-md border border-slate-700/50 bg-slate-800 shadow-lg backdrop-blur-sm"
          >
            {/* Header */}
            <div className="border-b border-slate-700/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Notifications
                </h3>
                <div className="flex space-x-1">
                  {notification.length > 0 && (
                    <>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                          title="Mark all as read"
                        >
                          <CheckCheck className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmClear(true)}
                        className="rounded p-1 text-slate-400 transition-colors hover:bg-red-900/20 hover:text-red-400"
                        title="Clear all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-500 border-t-slate-200"></div>
                </div>
              ) : notification.length > 0 ? (
                <ul className="divide-y divide-slate-700/30">
                  {notification.slice(0, 5).map((notif) => (
                    <li
                      key={notif.id}
                      className={cn(
                        "group relative px-4 py-3 transition-colors",
                        notif.is_read ? "bg-slate-800" : "bg-slate-800/60",
                        notif.url
                          ? "cursor-pointer hover:bg-slate-700/80"
                          : "hover:bg-slate-700/50",
                      )}
                      onClick={() =>
                        notif.url && handleNotificationClick(notif)
                      }
                    >
                      <div className={notif.url ? "pr-8" : ""}>
                        {/* Notification Title */}
                        <div className="flex items-start gap-2">
                          <div className="mt-1 flex-shrink-0">
                            {getNotificationIcon(notif)}
                          </div>
                          <div className="flex-1">
                            <h4
                              className={cn(
                                "line-clamp-2 font-medium",
                                notif.is_read ? "text-slate-300" : "text-white",
                              )}
                            >
                              {notif.title}
                            </h4>

                            {/* Notification Body */}
                            {(notif.body || (notif as any).message) && (
                              <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">
                                {notif.body ?? (notif as any).message}
                              </p>
                            )}

                            {/* Notification Time */}
                            <span className="mt-1 block text-xs text-slate-500">
                              {formatNotificationTime(notif.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mark as read button */}
                      {!notif.is_read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notif.id);
                          }}
                          className="absolute right-3 top-3 hidden rounded p-1 text-xs text-slate-400 opacity-0 transition-opacity hover:bg-slate-700 hover:text-white group-hover:block group-hover:opacity-100"
                          aria-label="Mark as read"
                        >
                          <CheckCheck className="h-4 w-4" />
                        </button>
                      )}

                      {/* Link Arrow for notification with URL */}
                      {notif.url && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="h-5 w-5 rounded-full border border-slate-600 text-slate-400 opacity-70 group-hover:border-slate-500 group-hover:text-slate-200">
                            <svg
                              className="h-full w-full"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                  <AlertCircle className="mb-2 h-8 w-8 opacity-40" />
                  <p>No notifications</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notification.length > 0 && (
              <div className="border-t border-slate-700/50 px-4 py-2">
                <Link
                  href="/notifications"
                  className="block text-center text-xs text-slate-400 hover:text-slate-200"
                  onClick={() => setOpen(false)}
                >
                  {notification.length > 5
                    ? `View all (${notification.length})`
                    : "View all"}{" "}
                  notifications
                </Link>
              </div>
            )}

            {/* Confirm Clear Dialog */}
            {confirmClear && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
                <div className="w-64 rounded-lg bg-slate-800 p-4 shadow-lg">
                  <h4 className="mb-1 text-lg font-semibold text-white">
                    Clear all?
                  </h4>
                  <p className="mb-4 text-xs text-slate-400">
                    This will delete all notifications. This action cannot be
                    undone.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="rounded bg-slate-700 px-3 py-1 text-xs font-medium text-white hover:bg-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
