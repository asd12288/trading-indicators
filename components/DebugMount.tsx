"use client";
import { useEffect } from "react";

export default function DebugMount({ name }: { name: string }) {
  useEffect(() => {
    console.log(`[DebugMount] ${name} mounted`);
  }, [name]);
  return null;
}
