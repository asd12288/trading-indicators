import SignalsList from "@/components/SignalCard/SignalsList";
import { createClient } from "@/database/supabase/server";
import { profile } from "console";

export const revalidate = 0;

async function page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

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
        <SignalsList profile={profile} />
      </div>
    </>
  );
}

export default page;
