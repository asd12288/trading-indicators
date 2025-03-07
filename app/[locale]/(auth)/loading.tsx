"use client";

import React from "react";
import dynamic from "next/dynamic";

// Import dynamically to ensure client-side only rendering
const GeneralLoader = dynamic(() => import("@/components/ui/GeneralLoader"), {
  ssr: false,
});

const Loading = () => {
  return <GeneralLoader fullScreen text="Authenticating..." />;
};

export default Loading;
