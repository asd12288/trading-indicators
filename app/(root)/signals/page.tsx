import SignalsList from "@/components/SignalCard/SignalsList";
import { createClient } from "@/database/supabase/server";

async function page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // You can redirect to the login page or show an error message
    return (
      <div className="flex min-h-screen">
        <div className="m-auto flex flex-col space-y-4 text-center">
          <h2 className="text-4xl font-bold">
            Please create an account or log in to see latest signals.
          </h2>
        </div>
      </div>
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return <div>Error fetching profile data.</div>;
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
        <SignalsList profile={profile} />
      </div>
    </>
  );
}

export default page;
