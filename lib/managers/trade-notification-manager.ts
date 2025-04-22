/**
 * Trade Notification Manager
 * Handles notifications for trade events (start, end, target/stop changes) based on user preferences
 */
import { createClient } from "@/database/supabase/client";
import { toast } from "@/hooks/use-toast";
import NotificationService from "@/lib/notification-service";
import { Signal } from "@/lib/types";

export class TradeNotificationManager {
  private static instance: TradeNotificationManager;
  private supabase;
  private activeSubscriptions: { [key: string]: any } = {};
  
  // Private constructor to enforce singleton pattern
  private constructor() {
    console.log("TradeNotificationManager initialized");
    this.supabase = createClient();
    
    // Initialize trade monitoring if in client environment
    if (typeof window !== "undefined") {
      this.initializeTradeMonitoring();
    }
  }

  // Get the singleton instance
  public static getInstance(): TradeNotificationManager {
    if (!TradeNotificationManager.instance) {
      TradeNotificationManager.instance = new TradeNotificationManager();
    }
    return TradeNotificationManager.instance;
  }

  /**
   * Initialize monitoring for trade events via Supabase real-time
   */
  private async initializeTradeMonitoring() {
    try {
      // Get current user
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return;

      console.log("Starting trade monitoring for user:", user.id);
      
      // Subscribe to all_signals table changes that should trigger notifications
      this.subscribeToNewSignals(user.id);
      this.subscribeToSignalUpdates(user.id);
      this.subscribeToTargetStopChanges(user.id);
      
    } catch (err) {
      console.error("Error initializing trade monitoring:", err);
    }
  }
  
  /**
   * Subscribe to new trades being created in the database
   */
  private subscribeToNewSignals(userId: string) {
    const signalStartChannel = this.supabase
      .channel('signal-starts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'all_signals'
        },
        (payload) => this.handleSignalStart(userId, payload.new as Signal)
      )
      .subscribe();
      
    this.activeSubscriptions['signal-starts'] = signalStartChannel;
  }
  
  /**
   * Subscribe to trade updates (completed trades)
   */
  private subscribeToSignalUpdates(userId: string) {
    const signalUpdateChannel = this.supabase
      .channel('signal-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'all_signals'
        },
        (payload) => {
          // Check if this update indicates a completed signal (entry_time and exit_time both exist)
          const newSignal = payload.new as Signal;
          const oldSignal = payload.old as Signal;
          
          if (newSignal.exit_time && !oldSignal.exit_time) {
            // Signal just completed
            this.handleSignalEnd(userId, newSignal);
          }
        }
      )
      .subscribe();
      
    this.activeSubscriptions['signal-updates'] = signalUpdateChannel;
  }
  
  /**
   * Subscribe to target/stop changes in trades
   */
  private subscribeToTargetStopChanges(userId: string) {
    const targetStopChannel = this.supabase
      .channel('target-stop-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'all_signals'
        },
        (payload) => {
          const newSignal = payload.new as Signal; 
          const oldSignal = payload.old as Signal;
          
          // Check if stop_loss or take_profit have changed
          if (
            (newSignal.stop_loss !== oldSignal.stop_loss) || 
            (newSignal.take_profit !== oldSignal.take_profit)
          ) {
            this.handleTargetStopChange(userId, oldSignal, newSignal);
          }
        }
      )
      .subscribe();
      
    this.activeSubscriptions['target-stop-changes'] = targetStopChannel;
  }
  
  /**
   * Handle a new signal starting
   */
  private async handleSignalStart(userId: string, signal: Signal) {
    try {
      const instrumentName = signal.instrument_name;
      
      // Check if this user has enabled notifications for this instrument
      const hasNotificationsEnabled = await this.checkUserNotificationPreference(userId, instrumentName);
      
      if (hasNotificationsEnabled) {
        // Show immediate toast to the user
        const isBuy = ["BUY", "LONG", "Buy", "Long"].includes(signal.direction || "");
        
        this.showToast(
          `New ${isBuy ? "Buy" : "Sell"} Signal`,
          `${instrumentName} signal started at ${signal.entry_price}`,
          "default",
          isBuy ? "arrow-up-right" : "arrow-down-right"
        );
        
        // Also create a persistent notification
        await NotificationService.notifyNewSignal(
          userId,
          instrumentName,
          isBuy ? "Buy" : "Sell"
        );
      }
    } catch (err) {
      console.error("Error in handleSignalStart:", err);
    }
  }
  
  /**
   * Handle a signal being completed
   */
  private async handleSignalEnd(userId: string, signal: Signal) {
    try {
      const instrumentName = signal.instrument_name;
      
      // Check if this user has enabled notifications for this instrument
      const hasNotificationsEnabled = await this.checkUserNotificationPreference(userId, instrumentName);
      
      if (hasNotificationsEnabled && signal.exit_price && signal.entry_price) {
        // Calculate profit/loss
        const isBuy = ["BUY", "LONG", "Buy", "Long"].includes(signal.direction || "");
        let profitLoss = 0;
        
        // Calculate P&L based on the direction of the trade
        if (isBuy) {
          profitLoss = signal.exit_price - signal.entry_price;
        } else {
          profitLoss = signal.entry_price - signal.exit_price;
        }
        
        const isProfit = profitLoss > 0;
        
        // Format P&L for display
        const plDisplay = Math.abs(profitLoss).toFixed(2);
        
        // Show toast notification
        this.showToast(
          `Signal Completed`,
          `${instrumentName} ${isBuy ? "Buy" : "Sell"} signal ended at ${signal.exit_price} (${isProfit ? "+" : "-"}${plDisplay})`,
          isProfit ? "success" : "default",
          isProfit ? "arrow-up-right" : "arrow-down-right"
        );
        
        // Create persistent notification
        await NotificationService.notifySignalCompleted(
          userId,
          instrumentName,
          profitLoss
        );
      }
    } catch (err) {
      console.error("Error in handleSignalEnd:", err);
    }
  }
  
  /**
   * Handle a target or stop-loss change
   */
  private async handleTargetStopChange(userId: string, oldSignal: Signal, newSignal: Signal) {
    try {
      const instrumentName = newSignal.instrument_name;
      
      // Check if this user has enabled notifications for this instrument
      const hasNotificationsEnabled = await this.checkUserNotificationPreference(userId, instrumentName);
      
      if (hasNotificationsEnabled) {
        // Check for stop loss change
        if (oldSignal.stop_loss !== newSignal.stop_loss && newSignal.stop_loss !== null) {
          const isBuy = ["BUY", "LONG", "Buy", "Long"].includes(newSignal.direction || "");
          
          this.showToast(
            "Stop Loss Updated",
            `${instrumentName} stop loss updated to ${newSignal.stop_loss}`,
            "default",
            "alert-triangle"
          );
          
          // Create persistent notification
          await NotificationService.createCustomNotification(
            userId,
            `Stop Loss Updated: ${instrumentName}`,
            `The stop loss for ${instrumentName} has been updated to ${newSignal.stop_loss}`,
            "trade",
            `/smart-alerts/${instrumentName}`,
            "View signal",
            1, // expires in 1 day
            {
              instrument_name: instrumentName,
              stop_loss: newSignal.stop_loss,
              previous_stop_loss: oldSignal.stop_loss
            }
          );
        }
        
        // Check for take profit change
        if (oldSignal.take_profit !== newSignal.take_profit && newSignal.take_profit !== null) {
          const isBuy = ["BUY", "LONG", "Buy", "Long"].includes(newSignal.direction || "");
          
          this.showToast(
            "Take Profit Updated",
            `${instrumentName} take profit updated to ${newSignal.take_profit}`,
            "default",
            "target"
          );
          
          // Create persistent notification
          await NotificationService.createCustomNotification(
            userId,
            `Take Profit Updated: ${instrumentName}`,
            `The take profit target for ${instrumentName} has been updated to ${newSignal.take_profit}`,
            "trade",
            `/smart-alerts/${instrumentName}`,
            "View signal",
            1, // expires in 1 day
            {
              instrument_name: instrumentName,
              take_profit: newSignal.take_profit,
              previous_take_profit: oldSignal.take_profit
            }
          );
        }
      }
    } catch (err) {
      console.error("Error in handleTargetStopChange:", err);
    }
  }

  /**
   * Check if a user has enabled notifications for a specific instrument
   */
  private async checkUserNotificationPreference(userId: string, instrumentName: string): Promise<boolean> {
    try {
      // Get user preferences
      const { data: profile, error } = await this.supabase
        .from("profiles")
        .select("preferences")
        .eq("id", userId)
        .single();
        
      if (error || !profile || !profile.preferences) {
        return false;
      }
      
      // Check if this instrument has notifications enabled
      const prefs = profile.preferences;
      return prefs[instrumentName]?.notifications === true;
      
    } catch (err) {
      console.error("Error checking notification preferences:", err);
      return false;
    }
  }

  /**
   * Find all users who have enabled notifications for a specific instrument
   * @param instrumentName - The trading instrument name
   * @returns Array of user IDs who have enabled notifications for this instrument
   */
  private async getUsersWithNotificationsEnabled(instrumentName: string): Promise<string[]> {
    try {
      // Query profiles where preferences contain the instrument with notifications enabled
      const { data, error } = await this.supabase
        .from("profiles")
        .select("id, preferences")
        .not("preferences", "is", null);
      
      if (error) {
        console.error("Error fetching user preferences:", error);
        return [];
      }

      // Filter users who have notifications enabled for this instrument
      const usersWithNotifications = data
        .filter(user => {
          const prefs = user.preferences || {};
          return prefs[instrumentName]?.notifications === true;
        })
        .map(user => user.id);

      return usersWithNotifications;
    } catch (err) {
      console.error("Error in getUsersWithNotificationsEnabled:", err);
      return [];
    }
  }

  /**
   * Show a toast notification that will be visible to the current user
   * @param title - The notification title
   * @param message - The notification message
   * @param variant - The notification variant/type
   * @param icon - Optional icon name (string)
   */
  private showToast(
    title: string, 
    message: string, 
    variant: "default" | "destructive" | "success" = "default",
    icon?: string
  ) {
    toast({
      title,
      description: message,
      variant,
      ...(icon ? { icon } : {})
    });
  }

  /**
   * Clean up subscriptions when component unmounts
   */
  public cleanup() {
    Object.values(this.activeSubscriptions).forEach(subscription => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    });
    
    this.activeSubscriptions = {};
    console.log("TradeNotificationManager: Cleaned up subscriptions");
  }
}

// Export a singleton instance
export const tradeNotificationManager = TradeNotificationManager.getInstance();