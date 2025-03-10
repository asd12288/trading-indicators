import supabaseClient from "@/database/supabase/supabase";
import { useEffect, useState } from "react";

export function useNewUserCheck(userId: string | undefined) {
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkIfNewUser() {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabaseClient
          .from("profiles")
          .select("first_login")
          .eq("id", userId)
          .single();

        if (error) throw error;

        // User is new if first_login is true or null
        setIsNewUser(profile?.first_login !== false);

        // If this is their first login, update the flag
        if (profile?.first_login !== false) {
          await supabaseClient
            .from("profiles")
            .update({ first_login: false })
            .eq("id", userId);
        }
      } catch (error) {
        console.error("Error checking if user is new:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkIfNewUser();
  }, [userId, supabaseClient]);

  return { isNewUser, isLoading };
}
