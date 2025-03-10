"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const WelcomeBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only mount component client-side to prevent hydration errors
  useEffect(() => {
    setMounted(true);

    // Check if the banner has been dismissed before
    const hasSeenBanner =
      localStorage.getItem("welcomeBannerClosed") === "true";
    if (!hasSeenBanner) {
      setShowBanner(true);
    }
  }, []);

  const closeBanner = () => {
    setShowBanner(false);
    localStorage.setItem("welcomeBannerClosed", "true");
  };

  // Don't render anything during SSR
  if (!mounted) return null;

  // Return null if banner should not be shown
  if (!showBanner) return null;

  // Use portal to render banner to a specific div at the root level
  return createPortal(
    <div
      className="fixed bottom-6 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 transform rounded-lg bg-slate-800 p-4 shadow-lg"
      role="region"
      aria-label="Welcome notification"
    >
      <button
        onClick={closeBanner}
        className="absolute right-2 top-2 rounded-full p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
        aria-label="Close banner"
      >
        <X size={16} />
      </button>
      <div className="mt-1">
        <h3 className="text-base font-medium text-white">
          Welcome to Trader Map
        </h3>
        <p className="mt-1 text-sm text-slate-300">
          Thank you for joining. Explore our trading signals and set up your
          notifications.
        </p>
      </div>
    </div>,
    // Mount to an element that exists in the DOM, not to body directly
    document.getElementById("portal-container") || document.body,
  );
};

export default WelcomeBanner;
