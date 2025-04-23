"use client";

import React from "react";
import dynamic from "next/dynamic";
import GeneralLoader from "@/components/ui/GeneralLoader";

// Import dynamically to ensure client-side only rendering
const TradingLoader = dynamic(() => import("@/components/ui/TradingLoader"), {
  ssr: false,
});

const Loading = () => {
  return <GeneralLoader fullScreen text="Loading trading platform..." />;
};

export default Loading;
