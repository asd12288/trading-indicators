"use client";

import { useEffect } from "react";

export default function AutoRefresh({
  intervalMs = 30000,
}: {
  intervalMs?: number;
}) {
  useEffect(() => {
    const timer = setInterval(() => {
      window.location.reload();
    }, intervalMs);

    // Clean up the interval on unmount
    return () => clearInterval(timer);
  }, [intervalMs]);

  return null; // This component doesn’t render anything visible
}
