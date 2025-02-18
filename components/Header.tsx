import { createClient } from "@/database/supabase/server";
import Navbar from "./Navbar";

export default async function Header() {
  const supabase = await createClient();

  // Get the authenticated user
  const { data: authData, error: authError } = await supabase.auth.getUser();
  const user = authData?.user || null;

  let profile = null;

  // Only query profile if user exists
  if (user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      profile = data;
    }
  }

  return <Navbar user={user} profile={profile} />;
}
