/**
 * Notification Manager - DISABLED
 * This file has been disabled as part of removing notification functionality
 * Toast notifications remain functional separately
 */

// Empty implementation to prevent import errors
export class NotificationManager {
  private static instance: NotificationManager;

  // Private constructor to enforce singleton pattern
  private constructor() {
    console.log("NotificationManager is disabled");
  }

  // Get the singleton instance
  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  // Empty implementations that return default values
  public async hasBeenSent(): Promise<boolean> {
    return false;
  }

  public async markAsSent(): Promise<boolean> {
    return false;
  }

  public markAsSentDebounced = async (): Promise<boolean> => {
    return false;
  };
}

// Export a singleton instance
export const notificationManager = NotificationManager.getInstance();
