"use client";

// This is a compatibility layer to redirect to our consolidated auth hook
import { useUser } from "@/providers/UserProvider";

/**
 * @deprecated Please use useUser() from "@/providers/UserProvider" instead.
 */
export function useAuth() {
  return useUser();
}
