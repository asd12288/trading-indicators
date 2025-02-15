import UserDashboard from "@/components/UserDashboard";
import { createClient } from "@/database/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.id) {
    return redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
  }

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <h2 className="mb-4 text-4xl font-semibold">My Profile</h2>
      <UserDashboard user={user} profile={profile} />
    </div>
  );
}
