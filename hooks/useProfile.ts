"use client";

import { useUser } from "@/providers/UserProvider";

/**
 * @deprecated Please use useUser() from "@/providers/UserProvider" instead.
 * This hook provides access to profile data directly from our consolidated auth hook.
 */
const useProfile = () => {
  // If userId is provided, we'll ignore it and use the authenticated user's profile
  // from our consolidated auth system
  const { profile, loading, error, isPro } = useUser();
  
  return { 
    profile, 
    isPro, 
    isLoading: loading, 
    error: error?.message || null 
  };
};

export default useProfile;
