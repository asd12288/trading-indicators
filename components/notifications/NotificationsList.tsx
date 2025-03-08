"use client";

import { Notification } from "@/lib/notification-types";
import NotificationCard from "./NotificationCard";
import { motion } from "framer-motion";

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function NotificationsList({
  notifications,
  onMarkAsRead,
  onDelete,
}: NotificationsListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {notifications.map((notification) => (
        <motion.div key={notification.id} variants={itemVariants}>
          <NotificationCard
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
