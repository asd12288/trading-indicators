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
      <div className="mb-8 flex flex-col items-center space-y-6">
        <h2 className="mt-8 border-b-2 text-5xl font-bold">
          Latest Signals per Instrument
        </h2>
        <p>
          New to the platform?{" "}
          <span className="hover:underline">check our guide</span> for better
          understanding
        </p>
        <SignalsList userId={user.id} />
      </div>
    </>
  );
}

export default page;
