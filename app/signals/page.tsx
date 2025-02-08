import FavoriteSignals from "@/components/FavoriteSignals";
import SignalCard from "@/components/SignalCard/SignalCard";
import { createClient } from "@/database/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

async function page() {
  const supabase = await createClient();

  const { data: signals } = await supabase.from("allSignals").select("*");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", user.id);

  if (!profiles) {
    return null;
  }

  const prefrences = profiles[0].preferences;

  const favouriteSignals = Object.keys(prefrences).filter(
    (signal) => prefrences[signal].favorite,
  );

  if (error) {
    console.error("Error fetching profiles:", error);
    return null;
  }

  if (!signals) {
    return <div>No signals found</div>;
  }

  return (
    <div className="mb-8 flex flex-col items-center space-y-6">
      <h2 className="mt-8 border-b-2 text-5xl font-bold">
        Latest Signals per Instrument
      </h2>

      <p>
        New to the platform?{" "}
        <span className="hover:underline">check our guide</span> for better
        understanding
      </p>

      {favouriteSignals.length > 0 && (
        <>
          <h2 className="mt-4 text-2xl font-medium">My Signals</h2>
          <FavoriteSignals favouriteSignals={favouriteSignals} />
          <div className="mb-2 w-full border-2 border-slate-400"></div>
        </>
      )}

      <div className="grid grid-cols-3 gap-8">
        {signals.map((signal) => (
          <Link key={signal.id} href={`/signals/${signal.name}`}>
            <SignalCard signalPassed={signal.name} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default page;
