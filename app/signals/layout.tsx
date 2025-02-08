import { Toaster } from "@/components/ui/toaster";
import React from "react";

function layout({ children }) {
  return (
    <>
      <div className="mt-10 flex justify-center">{children}</div>
      <Toaster />
    </>
  );
}

export default layout;
