"use client";

import { useAuth } from "@/context/auth-context";

export function useSession() {
  const { user, session, isLoading: loading } = useAuth();
  
  return {
    session,
    user,
    isLoading: loading
  };
}

export default useSession;
