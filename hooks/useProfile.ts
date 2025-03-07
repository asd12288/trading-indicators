"use client";

import { useState, useEffect } from "react";
import supabaseClient from "@/database/supabase/supabase.js";
import { Profile } from "@/lib/types";

const defaultProfile: Profile = {
  id: "",
  username: "Guest",
  email: "",
  avatar_url: "",
  created_at: new Date().toISOString(),
  plan: "free",
  role: "user",
  preferences: {
    notifications: true,
    volume: true,
    favorite: false,
  },
};

const useProfile = (userId: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) throw new Error(error.message);

        setProfile(data);
        setIsPro(data?.plan === "pro" || data?.plan === "premium");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, isPro, isLoading, error };
};

export default useProfile;
