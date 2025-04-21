"use client";

import { ReactNode, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/lib/types";
import { useUser } from "./UserProvider";

interface UserInitializerProps {
  user: User | null;
  profile: Profile | null;
  children: ReactNode;
}

/**
 * Component that initializes the UserProvider with server-fetched auth data
 * This bridges the gap between server and client authentication
 */
export function UserInitializer({
  user,
  profile,
  children,
}: UserInitializerProps) {
  const { refreshUser } = useUser();

  // Log the server-fetched data for debugging
  useEffect(() => {
    console.log("UserInitializer: Initializing with server auth data", {
      hasUser: !!user,
      hasProfile: !!profile,
    });

    // Store auth data in localStorage for persistence
    if (user && profile) {
      localStorage.setItem("serverAuthUser", JSON.stringify(user));
      localStorage.setItem("serverAuthProfile", JSON.stringify(profile));

      // Force a refresh of the client-side auth state
      refreshUser();
    }
  }, [user, profile, refreshUser]);

  return <>{children}</>;
}
