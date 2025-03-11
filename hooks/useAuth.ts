"use client";

import { useState, useEffect, useCallback } from "react";
import supabaseClient from "@/database/supabase/supabase";
import { User } from "@supabase/supabase-js";

// Define proper types
interface UserProfile {
  id: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  plan?: "free" | "pro";
  role?: string;
  [key: string]: any;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error: profileError } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      setProfile(data as UserProfile);
      return data;
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // First check if we have a session
      const { data: sessionData, error: sessionError } =
        await supabaseClient.auth.getSession();

      if (sessionError) throw sessionError;

      if (sessionData?.session) {
        // We have a session, now we can safely get the user
        const {
          data: { user },
          error,
        } = await supabaseClient.auth.getUser();

        if (error) throw error;

        if (user) {
          setUser(user);
          await fetchProfile(user.id);
        }
      } else {
        // No session found, clear user and profile
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.error("Error refreshing user:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    refreshUser();

    const { data } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
        }
      },
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  return { user, profile, loading, error, refreshUser };
}
