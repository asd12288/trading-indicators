import supabaseClient from "@/database/supabase/supabase";
import { set } from "date-fns";
import { useEffect, useState } from "react";

export default function useProfile(userId: string) {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setError(null);
      setIsLoading(true);
      const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setProfile(data);
      }
      setIsLoading(false);
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return { profile, isLoading, error };
}
