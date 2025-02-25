import supabaseClient from "@/database/supabase/supabase";

export async function useClients() {
  try {
    const { data, error } = await supabaseClient.rpc("get_paddle_subscriptions");

    if (error) {
      console.error("Supabase API Error:", error);
      return { clients: [] };
    }

    return { clients: data };
  } catch (err) {
    console.error("Fetch failed:", err);
    return { clients: [] };
  }
}
