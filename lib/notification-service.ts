/**
 * Notification Service
 * Responsible for creating different types of notifications
 */

import supabaseClient from "@/database/supabase/supabase";

export class NotificationService {
  /**
   * Create a new notification in the database
   */
  private static async createNotification(
    userId: string,
    title: string,
    message: string,
    type:
      | "signal"
      | "price"
      | "volatility"
      | "pattern"
      | "economic"
      | "subscription"
      | "milestone"
      | "risk"
      | "system",
    metadata: Record<string, any> = {},
  ): Promise<boolean> {
    try {
      // Check user notification preferences
      const { data: preferences } = await supabaseClient
        .from("notification_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      // Determine if notification should be sent based on user preferences
      let shouldSend = true;

      if (preferences) {
        switch (type) {
          case "signal":
            shouldSend = preferences.trading_signals;
            break;
          case "price":
            shouldSend = preferences.price_breakouts;
            break;
          case "volatility":
            shouldSend = preferences.volatility_alerts;
            break;
          case "pattern":
            shouldSend = preferences.pattern_alerts;
            break;
          case "economic":
            shouldSend = preferences.economic_events;
            break;
          case "subscription":
            shouldSend = preferences.subscription_reminders;
            break;
          case "milestone":
            shouldSend = preferences.performance_milestones;
            break;
          case "risk":
            shouldSend = preferences.risk_alerts;
            break;
          case "system":
            shouldSend = true; // System notifications are always sent
            break;
        }
      }

      // If user preference is set to not receive this notification type, skip it
      if (!shouldSend) {
        console.log(`Notification skipped due to user preferences: ${type}`);
        return false;
      }

      // Insert the notification into the database
      const { error } = await supabaseClient.from("notifications").insert({
        user_id: userId,
        title,
        message,
        type,
        metadata,
        read: false,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error creating notification:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in createNotification:", error);
      return false;
    }
  }

  /**
   * Notify a user about a new trading signal
   */
  public static async notifyNewSignal(
    userId: string,
    instrumentName: string,
    direction: string,
  ): Promise<boolean> {
    const title = `New ${direction.toUpperCase()} Signal`;
    const message = `A new ${direction.toLowerCase()} signal has been detected for ${instrumentName}`;

    return this.createNotification(userId, title, message, "signal", {
      instrument: instrumentName,
      direction,
    });
  }

  /**
   * Notify a user about a price breakout
   */
  public static async notifyPriceBreakout(
    userId: string,
    instrumentName: string,
    price: number,
    breakoutType: "resistance" | "support" | "key_level",
    timeframe: string,
  ): Promise<boolean> {
    const breakoutTypeFormatted = breakoutType.replace("_", " ");
    const title = `${instrumentName} Price Breakout`;
    const message = `${instrumentName} has broken ${breakoutTypeFormatted} at ${price} on ${timeframe} timeframe`;

    return this.createNotification(userId, title, message, "price", {
      instrument: instrumentName,
      price,
      breakout_type: breakoutType,
      timeframe,
    });
  }

  /**
   * Notify a user about a volatility change
   */
  public static async notifyVolatilityChange(
    userId: string,
    instrumentName: string,
    volatilityLevel: "increasing" | "decreasing" | "extreme",
    percentChange: number,
  ): Promise<boolean> {
    const title = `${instrumentName} Volatility Alert`;
    const message = `${instrumentName} volatility is ${volatilityLevel} by ${percentChange.toFixed(1)}%`;

    return this.createNotification(userId, title, message, "volatility", {
      instrument: instrumentName,
      volatility_level: volatilityLevel,
      percent_change: percentChange,
    });
  }

  /**
   * Notify a user about a pattern detection
   */
  public static async notifyPatternDetected(
    userId: string,
    instrumentName: string,
    patternType: string,
    reliability: "low" | "medium" | "high",
    timeframe: string,
  ): Promise<boolean> {
    const title = `${patternType} Pattern Detected`;
    const message = `A ${reliability} reliability ${patternType} pattern was detected on ${instrumentName} ${timeframe}`;

    return this.createNotification(userId, title, message, "pattern", {
      instrument: instrumentName,
      pattern_type: patternType,
      reliability,
      timeframe,
    });
  }

  /**
   * Notify a user about an economic event
   */
  public static async notifyEconomicEvent(
    userId: string,
    eventName: string,
    impact: "low" | "medium" | "high",
    timeUntilEvent: string,
    affectedInstruments: string[],
  ): Promise<boolean> {
    const title = `Economic Event: ${eventName}`;
    const instrumentsList = affectedInstruments.join(", ");
    const message = `${impact.toUpperCase()} impact event ${eventName} in ${timeUntilEvent}. May affect: ${instrumentsList}`;

    return this.createNotification(userId, title, message, "economic", {
      event_name: eventName,
      impact,
      time_until_event: timeUntilEvent,
      affected_instruments: affectedInstruments,
    });
  }

  /**
   * Notify a user about their subscription expiration
   */
  public static async notifySubscriptionReminder(
    userId: string,
    daysLeft: number,
  ): Promise<boolean> {
    const title = "Subscription Reminder";
    let message = "";

    if (daysLeft === 1) {
      message =
        "Your subscription expires in 1 day. Renew now to avoid interruption.";
    } else {
      message = `Your subscription expires in ${daysLeft} days. Renew now to avoid interruption.`;
    }

    return this.createNotification(userId, title, message, "subscription", {
      days_left: daysLeft,
    });
  }

  /**
   * Notify a user about a trading milestone
   */
  public static async notifyTradingMilestone(
    userId: string,
    milestoneType: "win-streak" | "trade-count" | "profit-goal" | "performance",
    value: number,
  ): Promise<boolean> {
    let title = "";
    let message = "";

    switch (milestoneType) {
      case "win-streak":
        title = "Trading Milestone: Win Streak";
        message = `Congratulations! You've achieved a ${value} trade win streak.`;
        break;
      case "trade-count":
        title = "Trading Milestone: Trade Count";
        message = `Congratulations! You've completed ${value} trades.`;
        break;
      case "profit-goal":
        title = "Trading Milestone: Profit Goal";
        message = `Congratulations! You've reached your profit goal of ${value}.`;
        break;
      case "performance":
        title = "Trading Milestone: Performance Improvement";
        message = `Your trading performance has improved by ${value}% compared to your previous average.`;
        break;
    }

    return this.createNotification(userId, title, message, "milestone", {
      milestone_type: milestoneType,
      value,
    });
  }

  /**
   * Notify a user about a risk level change
   */
  public static async notifyRiskLevelChange(
    userId: string,
    instrumentName: string,
    riskLevel: "low" | "medium" | "high" | "extreme",
    previousLevel: "low" | "medium" | "high" | "extreme",
  ): Promise<boolean> {
    const title = `Risk Alert: ${instrumentName}`;
    const message = `${instrumentName} risk level has changed from ${previousLevel} to ${riskLevel}`;

    return this.createNotification(userId, title, message, "risk", {
      instrument: instrumentName,
      risk_level: riskLevel,
      previous_level: previousLevel,
    });
  }

  /**
   * Send a system notification to a user
   */
  public static async notifySystem(
    userId: string,
    title: string,
    message: string,
  ): Promise<boolean> {
    return this.createNotification(userId, title, message, "system", {});
  }
}
