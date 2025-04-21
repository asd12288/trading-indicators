"use client";

import { useUser } from "@/providers/UserProvider";

/**
 * @deprecated Please use useUser() from "@/providers/UserProvider" instead.
 * This hook provides backward compatibility with existing components.
 */
export function useSession() {
  const { session, loading: isLoading, error } = useUser();
  return { session, isLoading, error };
}

export default useSession;
