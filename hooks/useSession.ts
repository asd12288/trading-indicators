"use client";

import { useState, useEffect } from "react";
import supabaseClient from "@/database/supabase/supabase";
import { Session } from "@supabase/supabase-js";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabaseClient.auth.getSession();

        if (error) {
          throw error;
        }

        setSession(data.session);
      } catch (err) {
        console.error("Error fetching session:", err);
        setError(err instanceof Error ? err.message : "Failed to load session");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { session, isLoading, error };
}

export default useSession;
