import { useEffect } from "react";
import { useSession } from "@/hooks/use-session";
import { NotificationService } from "@/lib/notification-service";

/**
 * AccountNotificationManager is a hidden component that automatically 
 * generates important notifications related to user account status.
 * It should be mounted once in the app, preferably in a layout component.
 */
export default function AccountNotificationManager() {
  const { session, profile } = useSession();
  const userId = session?.user?.id;
  
  useEffect(() => {
    // Only continue if we have a valid session and user profile
    if (!userId || !profile) return;
    
    const sendAccountNotifications = async () => {
      try {
        // Check for subscription expiration
        if (profile.subscription_end_date) {
          const endDate = new Date(profile.subscription_end_date);
          const today = new Date();
          const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          // Send reminder when subscription is ending soon (7 days, 3 days, 1 day)
          if (daysLeft <= 7 && daysLeft > 0) {
            await NotificationService.notifySubscriptionReminder(userId, daysLeft);
          }
        }
        
        // Check if this is a free plan user who has been active for a while
        if (!profile.plan || profile.plan === "free") {
          const createdAt = new Date(profile.created_at);
          const today = new Date();
          const daysSinceCreation = Math.ceil((today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
          
          // For users active more than 7 days, suggest an upgrade
          if (daysSinceCreation > 7) {
            // Check local storage to ensure we don't send this notification too frequently
            const lastPromo = localStorage.getItem("last_promo_notification");
            const lastPromoDate = lastPromo ? new Date(lastPromo) : null;
            
            // Only send promo notification if we haven't sent one in the last 7 days
            if (!lastPromoDate || (today.getTime() - lastPromoDate.getTime()) > 7 * 24 * 60 * 60 * 1000) {
              await NotificationService.notifyProFeature(userId, "Real-time Signal Alerts");
              localStorage.setItem("last_promo_notification", today.toISOString());
            }
          }
        }
        
        // Check for system notices and new features
        // This could be expanded to check against a "features" table in your database
        const lastFeatureCheck = localStorage.getItem("last_feature_check");
        if (!lastFeatureCheck || (new Date().getTime() - new Date(lastFeatureCheck).getTime() > 24 * 60 * 60 * 1000)) {
          // Example: Check for new features added in the last month
          // This could be improved by checking against actual feature launch dates in your database
          const recentFeatures = ["Trading Calendar Integration", "Advanced Signal Filtering"];
          
          // Notify about one random new feature
          const randomFeature = recentFeatures[Math.floor(Math.random() * recentFeatures.length)];
          await NotificationService.notifyNewFeature(userId, randomFeature);
          
          localStorage.setItem("last_feature_check", new Date().toISOString());
        }
        
      } catch (error) {
        console.error("Failed to send account notifications:", error);
      }
    };
    
    // Run immediately on component mount
    sendAccountNotifications();
    
    // Also set up a daily check interval
    const checkInterval = setInterval(sendAccountNotifications, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(checkInterval);
  }, [userId, profile]);
  
  // This component doesn't render anything
  return null;
}