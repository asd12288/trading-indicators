"use client";

import { useState, useEffect } from "react";
import supabaseClient from "@/database/supabase/supabase.js";

const useProfile = (userId: string) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
          // Set default profile data if there's an error
          setProfile({
            id: userId,
            preferences: {},
            // add other default fields as needed
          });
        } else {
          // Ensure profile has preferences object
          setProfile({
            ...data,
            preferences: data?.preferences || {},
          });
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        // Set default profile data on error
        setProfile({
          id: userId,
          preferences: {},
        });
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
