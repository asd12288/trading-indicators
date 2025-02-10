import Image from "next/image";
import { createClient } from "@/database/supabase/server";
import UserDashboard from "@/components/UserDashboard";

async function page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", user?.id);

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <h2 className="fonr-semibold mb-4 text-4xl">My Profile</h2>
      <UserDashboard user={user} profile={profile} />
    </div>
  );
}

export default page;
