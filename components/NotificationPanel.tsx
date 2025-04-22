"use client";

import { Button } from "@/components/ui/button";
import { Notification } from "@/types/notifications";
import { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem";
import { Loader2, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface NotificationPanelProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
}

export default function NotificationPanel({
  notifications,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
  unreadCount,
}: NotificationPanelProps) {
  return (
    <div className="flex h-[28rem] w-80 flex-col rounded-lg border border-slate-700 bg-slate-900 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <h3 className="font-medium text-slate-100">Notifications</h3>
        <div className="flex items-center">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs text-slate-400 hover:text-slate-100"
            >
              <Check className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
            <div className="mb-2 rounded-full bg-slate-800 p-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-slate-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
            </div>
            <h4 className="mb-1 text-sm font-medium text-slate-300">No notifications yet</h4>
            <p className="text-xs text-slate-500">When you get notifications, they'll appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={onMarkAsRead}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-slate-800 p-3">
          <p className="text-center text-xs text-slate-500">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` 
              : 'All caught up!'}
          </p>
        </div>
      )}
    </div>
  );
}
