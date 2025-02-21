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

  return (
    <div className="flex flex-col items-center justify-center p-2 md:p-12">
      <h2 className="mb-4 text-2xl font-semibold md:text-4xl">My Profile</h2>
      <UserDashboard user={user} />
    </div>
  );
}
