import supabaseClient from "@/database/supabase/supabase";
import { useState, useEffect } from "react";

export function useSignalsStatus() {
  const [signalsStatus, setSignalsStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabaseClient
          .from("status_alert")
          .select("*")
          .order("time", { ascending: false })
          .limit(1000);

        setSignalsStatus(data);
      } catch (error: any) {
        setError(error)
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Optional: re-fetch data every minute for better UX
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, []);

  return { signalsStatus, loading, error };
}
