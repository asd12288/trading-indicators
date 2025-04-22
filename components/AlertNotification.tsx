"use client";

/**
 * AlertNotification - DISABLED
 * This component has been disabled as part of removing all notification functionality
 */
interface AlertNotificationProps {
  userId: string;
  instrumentName?: string;
  variant?: "default" | "compact";
}

const AlertNotification = ({
  userId,
  instrumentName = "",
  variant = "default",
}) => {
  // Return an empty div as this functionality has been disabled
  return (
    <div className="flex h-16 w-full items-center justify-center rounded-lg bg-slate-800/80 px-4 text-sm text-slate-300">
      Alert notifications have been disabled
    </div>
  );
};

export default AlertNotification;
