import FavoriteSignals from "@/components/FavoriteSignals";
import SignalCard from "@/components/SignalCard/SignalCard";
import { createClient } from "@/database/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

async function page() {
  const supabase = await createClient();

  const { data: signals, error: signalErrors } = await supabase
    .from("all_signals")
    .select("*")
    .order("entry_time", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  if (signalErrors) {
    console.error("Error fetching signals:", signalErrors);
    return <div>Error fetching signals</div>;
  }

  if (!signals) {
    return <div>No signals found</div>;
  }

  const latestByInstrument = new Map();
  for (const signal of signals) {
    if (!latestByInstrument.has(signal.instrument_name)) {
      latestByInstrument.set(signal.instrument_name, signal);
    }
  }
  const latestSignals = [...latestByInstrument.values()];

  const { data, error } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profiles:", error);
    return null;
  }

  const { preferences } = data;

  const favouriteSignalNames = Object.keys(preferences).filter(
    (instrument) => preferences[instrument].favorite,
  );
  const favouriteSignals = latestSignals.filter((signal) =>
    favouriteSignalNames.includes(signal.instrument_name),
  );

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
          <FavoriteSignals
            favouriteSignals={favouriteSignals}
            preferences={preferences}
          />
          <div className="mb-2 w-full border-2 border-slate-400"></div>
        </>
      )}

      <div className="grid grid-cols-3 gap-8">
        {latestSignals.map((signal, index) => (
          <Link
            key={signal.id ?? `${signal.instrument_name}-${index}`}
            href={`/signals/${encodeURIComponent(signal.instrument_name)}`}
          >
            <SignalCard signalPassed={signal} preferences={preferences} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default page;
