// Utility to handle notification sounds centrally
// This prevents duplicate sounds from being played when notifications arrive

// Track the last time a notification sound was played
let lastPlayedTime = 0;
const DEBOUNCE_TIME = 500; // Minimum time between sounds (milliseconds)

/**
 * Plays the notification sound with debouncing to prevent multiple
 * sounds from playing in quick succession
 */
export function playNotificationSound() {
  const now = Date.now();

  // Only play if enough time has elapsed since the last sound
  if (now - lastPlayedTime > DEBOUNCE_TIME) {
    try {
      const audio = new Audio("/audio/notification.mp3");
      audio.volume = 0.5;
      audio.play().catch((err) => console.log("Audio play failed:", err));
      lastPlayedTime = now;
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  } else {
    console.log("Notification sound debounced");
  }
}
