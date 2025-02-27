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

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          setError(error.message);
          setProfile({
            ...defaultProfile,
            id: userId,
          });
        } else {
          // Ensure profile has preferences object
          setProfile({
            ...data,
            preferences: data?.preferences || defaultProfile.preferences,
          });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setProfile({ ...defaultProfile, id: userId });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const isPro = profile?.plan === "pro";
  const isAdmin = profile?.role === "admin";

  return { profile, isLoading, isPro, isAdmin };
};

export default useProfile;
