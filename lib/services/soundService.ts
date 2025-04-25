"use client";

// Types for signal events
export type SignalEventType = "new" | "completed" | "alert";

// Sound configurations by event type
interface SoundConfig {
  src: string;
  volume: number;
}

// Map of event types to sound configurations
const SOUND_CONFIG: Record<SignalEventType, SoundConfig> = {
  new: { src: "/audio/newSignal.mp3", volume: 0.6 },
  completed: { src: "/audio/endSignal.mp3", volume: 0.5 }, // Using default for now, can be changed later
  alert: { src: "/audio/notification.mp3", volume: 0.7 }, // Using default for now, can be changed later
};

// Default sound for fallback
const DEFAULT_SOUND = "/audio/notification.mp3";
const DEFAULT_VOLUME = 0.5;

// Track the last time a notification sound was played (debouncing)
let lastPlayedTime = 0;
const DEBOUNCE_TIME = 500; // Minimum time between sounds (milliseconds)

// Global mute state
let globalMuteEnabled = false;

/**
 * Sound Service that handles playing audio notifications for different signal events
 */
class SoundService {
  /**
   * Set global mute status
   */
  static setGlobalMute(muted: boolean): void {
    globalMuteEnabled = muted;
    console.log(`[SoundService] Global mute set to: ${muted}`);
  }

  /**
   * Get global mute status
   */
  static isGloballyMuted(): boolean {
    return globalMuteEnabled;
  }

  /**
   * Play a sound for a specific event type with debouncing
   * Try instrument-specific audio; fall back to configured sound.
   */
  static playSound(
    eventType: SignalEventType = "new",
    instrument?: string,
  ): void {
    // Check if globally muted
    if (globalMuteEnabled) {
      console.log('[SoundService] Sound not played due to global mute setting');
      return;
    }
    
    console.log(
      `[SoundService] Attempting to play sound for event type: ${eventType}`,
    );
    const now = Date.now();

    // Only play if enough time has elapsed since the last sound
    if (now - lastPlayedTime > DEBOUNCE_TIME) {
      try {
        const config = SOUND_CONFIG[eventType] || {
          src: DEFAULT_SOUND,
          volume: DEFAULT_VOLUME,
        };
        console.log(
          `[SoundService] Playing sound: ${config.src} with volume: ${config.volume}`,
        );

        // Try instrument-specific file
        let src = config.src;
        if (instrument) {
          console.log(`Instrument provided: ${instrument}`);
          const suffix =
            eventType === "new"
              ? "start"
              : eventType === "completed"
                ? "end"
                : "notification";
          src = `/audio/${instrument.toLowerCase()}-${suffix}.mp3`;
        }
        const audio = new Audio(src);
        audio.volume = config.volume;

        audio
          .play()
          .then(() =>
            console.log(`[SoundService] Sound playback started: ${src}`),
          )
          .catch((err) => {
            console.warn(
              `[SoundService] Failed to play ${src}, falling back`,
              err,
            );
            // fallback to default or config sound
            const fallback = new Audio(config.src);
            fallback.volume = config.volume;
            fallback
              .play()
              .catch((e) =>
                console.error(`[SoundService] Fallback play failed:`, e),
              );
          });

        lastPlayedTime = now;
      } catch (error) {
        console.error(
          "[SoundService] Error playing notification sound:",
          error,
        );
      }
    } else {
      console.log(
        `[SoundService] Sound debounced. Too soon since last sound (${now - lastPlayedTime}ms)`,
      );
    }
  }

  /**
   * Play a sound for a new signal
   */
  static playNewSignal(instrument?: string): void {
    console.log("[SoundService] playNewSignal called for", instrument);
    this.playSound("new", instrument);
  }

  /**
   * Play a sound for a completed signal
   */
  static playCompletedSignal(instrument?: string): void {
    console.log("[SoundService] playCompletedSignal called for", instrument);
    this.playSound("completed", instrument);
  }

  /**
   * Play a sound for a generic alert
   */
  static playAlert(): void {
    console.log("[SoundService] playAlert called");
    this.playSound("alert");
  }

  /**
   * Initialize audio (useful for mobile devices where audio
   * playback requires user interaction)
   */
  static initializeAudio(): void {
    console.log("[SoundService] Initializing audio system");
    try {
      const silentAudio = new Audio(DEFAULT_SOUND);
      silentAudio.volume = 0;
      silentAudio
        .play()
        .then(() =>
          console.log("[SoundService] Audio initialized successfully"),
        )
        .catch((err) =>
          console.log(
            "[SoundService] Audio initialization suppressed error:",
            err,
          ),
        );
    } catch (error) {
      console.error("[SoundService] Failed to initialize audio:", error);
    }
  }
}

export default SoundService;
