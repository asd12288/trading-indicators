import AlertNotification from "@/components/AlertNotification";
import SignalsList from "@/components/SignalCard/SignalsList";
import { createClient } from "@/database/supabase/server";
import { redirect } from "next/navigation";

async function page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If there's an error or user is missing, redirect to login
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <div className="mb-8 flex flex-col items-center space-y-4 md:space-y-6">
        <div className="rounded-lg bg-slate-800 p-8">
          <div className="flex w-full items-baseline justify-between">
            <h2 className="md:text-3xl text-xl font-medium">Latest Signals</h2>
            <p className="md:text-2xl text-lg text-gray-400">
              Signals Status:{" "}
              <span className="animate-pulse md:text-2xl text-slate-50">Live</span>
            </p>
          </div>
          <div className="mt-3 rounded-lg bg-gray-700 p-2">
            <AlertNotification userId={user.id} />
          </div>
          <SignalsList userId={user.id} />
        </div>
      </div>
    </>
  );
}

export default page;
