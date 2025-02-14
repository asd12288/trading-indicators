import AutoRefresh from "@/components/AutoRefresh";
import FavoriteSignals from "@/components/FavoriteSignals";
import SignalCard from "@/components/SignalCard/SignalCard";
import { fetchSignalsData } from "@/lib/fetchSignalsData";
import Link from "next/link";

async function page() {
  let signalsData;
  try {
    signalsData = await fetchSignalsData();
  } catch (error) {
    console.error("Error fetching signals:", error);
    return <div>Error fetching signals</div>;
  }

  const { latestSignals, favouriteSignals, preferences } = signalsData;

  return (
    <>
      <AutoRefresh intervalMs={30000} />
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
          <FavoriteSignals
            favouriteSignals={favouriteSignals}
            preferences={preferences}
          />
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
    </>
  );
}

export default page;
