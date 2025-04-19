import { createClient } from "@/database/supabase/server";
import Navbar from "./Navbar";

export default async function Header() {
  const supabase = await createClient();

  // Get the server-side session
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user || null;

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = data || null;
  }

  return <Navbar serverUser={user} serverProfile={profile} />;
}
