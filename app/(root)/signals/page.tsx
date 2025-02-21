import AlertNotification from "@/components/AlertNotification";
import SignalsList from "@/components/SignalCard/SignalsList";
import { createClient } from "@/database/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

async function page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <div className="mb-8 flex flex-col items-center space-y-4 md:space-y-6">
        <div className="rounded-lg bg-slate-800 p-8">
          <div className="flex w-full items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <h2 className="text-xl font-medium md:text-3xl">
                Latest Signals
              </h2>
              <Link href="/info">
                <p className="text-sm font-light hover:underline">
                  New to the platform?
                </p>
              </Link>
            </div>
            <p className="text-lg text-gray-400 md:text-2xl">
              Signals Status:{" "}
              <span className="animate-pulse text-slate-50 md:text-2xl">
                Live
              </span>
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
