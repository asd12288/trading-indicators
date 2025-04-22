/**
 * Notification Service
 * Utility functions for creating and managing notifications
 */
import { createClient } from "@/database/supabase/client";
import { NotificationType } from "@/types/notifications";

// Helper function to get the current locale (defaults to "en")
const getCurrentLocale = (): string => {
  // In a browser environment, we can try to get the locale from URL
  if (typeof window !== "undefined") {
    const pathParts = window.location.pathname.split("/");
    // Typical path structure is /{locale}/rest-of-path
    if (pathParts.length > 1 && pathParts[1]) {
      const possibleLocale = pathParts[1];
      // Basic validation - you may want to check against your supported locales
      if (possibleLocale.length === 2) {
        return possibleLocale;
      }
    }
  }
  return "en"; // Default locale
};

class NotificationService {
  /**
   * Create a new notification for a user
   */
  private static async createNotification({
    userId,
    title,
    message,
    type = "system",
    link = null,
    linkText = null,
    expiresInDays = null,
    additionalData = {},
  }: {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
    link?: string | null;
    linkText?: string | null;
    expiresInDays?: number | null;
    additionalData?: Record<string, any>;
  }) {
    try {
      if (!userId) {
        console.error("Error creating notification: userId is required");
        return false;
      }

      const supabase = createClient();

      // Calculate expiry date if provided
      let expiresAt = null;
      if (expiresInDays !== null) {
        const date = new Date();
        date.setDate(date.getDate() + expiresInDays);
        expiresAt = date.toISOString();
      }

      // Add link text to additional data if provided
      const data = { ...additionalData };
      if (linkText) {
        data.link_text = linkText;
      }

      // Prepend locale to link if it's a relative URL and doesn't already have a locale
      let processedLink = link;
      if (
        link &&
        link.startsWith("/") &&
        !link.startsWith(`/${getCurrentLocale()}`)
      ) {
        processedLink = `/${getCurrentLocale()}${link}`;
      }

      // Create the notification payload
      const notificationPayload = {
        user_id: userId,
        title,
        message,
        type,
        link: processedLink,
        expires_at: expiresAt,
        additional_data: Object.keys(data).length > 0 ? data : null,
      };

      console.log(
        "Creating notification with payload:",
        JSON.stringify(notificationPayload),
      );

      const { error } = await supabase
        .from("notifications")
        .insert(notificationPayload);

      if (error) {
        console.error("Error creating notification:", error.message);
        console.error("Error details:", error);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Error in createNotification:", err);
      return false;
    }
  }

  /**
   * Create a custom notification with full control over all parameters
   */
  public static async createCustomNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = "system",
    link?: string,
    linkText?: string,
    expiresInDays?: number | null,
    additionalData: Record<string, any> = {},
  ) {
    return this.createNotification({
      userId,
      title,
      message,
      type,
      link: link || null,
      linkText: linkText || null,
      expiresInDays: expiresInDays !== undefined ? expiresInDays : null,
      additionalData,
    });
  }

  /**
   * Notify when a user first views a new signal/instrument
   */
  public static async notifyNewSignalView(
    userId: string,
    signalId: string,
    signalData: any,
  ) {
    return this.createNotification({
      userId,
      title: "Signal Viewed",
      message: `First view: ${signalId}`,
      type: "info",
      link: `/smart-alerts/${signalId}`,
      linkText: "View",
      expiresInDays: 7,
      additionalData: {
        signal_id: signalId,
        first_view: true,
      },
    });
  }

  /**
   * Notify when a new signal is detected
   */
  public static async notifyNewSignal(
    userId: string,
    signalId: string,
    signalType: string,
  ) {
    return this.createNotification({
      userId,
      title: "New Signal",
      message: `${signalType} signal for ${signalId}`,
      type: "alert",
      link: `/smart-alerts/${signalId}`,
      linkText: "View",
      additionalData: {
        signal_id: signalId,
        signal_type: signalType,
      },
    });
  }

  /**
   * Notify when a signal is completed
   */
  public static async notifySignalCompleted(
    userId: string,
    signalId: string,
    profitLoss: number,
  ) {
    const isProfit = profitLoss >= 0;
    const absValue = Math.abs(profitLoss).toFixed(2);

    return this.createNotification({
      userId,
      title: `${signalId} Completed`,
      message: `${isProfit ? "+" : "-"}${absValue}% ${isProfit ? "profit" : "loss"}`,
      type: "trade",
      link: `/smart-alerts/${signalId}`,
      linkText: "View results",
      additionalData: {
        signal_id: signalId,
        profit_loss: profitLoss,
        completed: true,
      },
    });
  }

  /**
   * Notify about account events (subscription, payment, etc)
   */
  public static async notifyAccount(
    userId: string,
    title: string,
    message: string,
    link?: string,
  ) {
    return this.createNotification({
      userId,
      title,
      message,
      type: "account",
      link,
      expiresInDays: 30,
    });
  }

  /**
   * Notify about payment processing
   */
  public static async notifyPaymentProcessed(
    userId: string,
    amount: number,
    currency: string,
    subscriptionPlan?: string,
  ) {
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);

    const planInfo = subscriptionPlan
      ? ` for your ${subscriptionPlan} plan`
      : "";

    return this.createNotification({
      userId,
      title: "Payment Processed",
      message: `Payment of ${formattedAmount}${planInfo} processed.`,
      type: "account",
      link: "/profile",
      linkText: "View subscription",
      expiresInDays: 30,
      additionalData: {
        amount,
        currency,
        subscription_plan: subscriptionPlan,
        payment_status: "completed",
      },
    });
  }

  /**
   * Notify about payment failure
   */
  public static async notifyPaymentFailed(
    userId: string,
    amount: number,
    currency: string,
    errorMessage: string,
  ) {
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);

    return this.createNotification({
      userId,
      title: "Payment Failed",
      message: `Payment of ${formattedAmount} failed: ${errorMessage}`,
      type: "account",
      link: "/profile",
      linkText: "Update payment",
      expiresInDays: 7,
      additionalData: {
        amount,
        currency,
        payment_status: "failed",
        error_message: errorMessage,
      },
    });
  }

  /**
   * Notify about subscription changes
   */
  public static async notifySubscriptionChanged(
    userId: string,
    newPlanName: string,
    effectiveDate: Date = new Date(),
  ) {
    const formattedDate = effectiveDate.toLocaleDateString();

    return this.createNotification({
      userId,
      title: "Subscription Updated",
      message: `Updated to ${newPlanName}, effective ${formattedDate}.`,
      type: "account",
      link: "/profile",
      linkText: "View details",
      expiresInDays: 30,
      additionalData: {
        new_plan: newPlanName,
        effective_date: effectiveDate.toISOString(),
      },
    });
  }

  /**
   * Notify about subscription expiration
   */
  public static async notifySubscriptionExpiringSoon(
    userId: string,
    planName: string,
    expiryDate: Date,
  ) {
    const formattedDate = expiryDate.toLocaleDateString();
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    );

    return this.createNotification({
      userId,
      title: "Subscription Expiring",
      message: `${planName} expires in ${daysUntilExpiry} days (${formattedDate}).`,
      type: "account",
      link: "/profile?tab=subscription",
      linkText: "Renew",
      expiresInDays: daysUntilExpiry + 1,
      additionalData: {
        plan_name: planName,
        expiry_date: expiryDate.toISOString(),
        days_until_expiry: daysUntilExpiry,
      },
    });
  }

  /**
   * Notify for system alerts
   */
  public static async notifySystem(
    userId: string,
    title: string,
    message: string,
    link?: string,
  ) {
    return this.createNotification({
      userId,
      title,
      message,
      type: "system",
      link,
      expiresInDays: 7,
    });
  }

  /**
   * Notify about system maintenance
   */
  public static async notifyMaintenance(
    userId: string,
    startTime: Date,
    estimatedDuration: number, // in minutes
    affectedServices: string[] = ["All services"],
  ) {
    const formattedTime = startTime.toLocaleString();
    const services = affectedServices.join(", ");

    return this.createNotification({
      userId,
      title: "Maintenance Scheduled",
      message: `Maintenance on ${formattedTime} for ${estimatedDuration} mins. Affected: ${services}.`,
      type: "system",
      link: "/status",
      linkText: "Status",
      expiresInDays: 1,
      additionalData: {
        maintenance_start: startTime.toISOString(),
        estimated_duration: estimatedDuration,
        affected_services: affectedServices,
      },
    });
  }

  /**
   * Notify about a new feature
   */
  public static async notifyNewFeature(
    userId: string,
    featureName: string,
    featureDescription: string,
    featureLink?: string,
  ) {
    return this.createNotification({
      userId,
      title: `New: ${featureName}`,
      message: featureDescription,
      type: "system",
      link: featureLink,
      linkText: "Learn more",
      expiresInDays: 14,
      additionalData: {
        feature_name: featureName,
        is_feature_announcement: true,
      },
    });
  }
}

export default NotificationService;
