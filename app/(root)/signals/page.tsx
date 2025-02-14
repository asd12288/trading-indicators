import FavoriteSignals from "@/components/FavoriteSignals";
import SignalCard from "@/components/SignalCard/SignalCard";
import SignalsList from "@/components/SignalCard/SignalsList";
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
      <div className="mb-8 flex flex-col items-center space-y-6">
        <h2 className="mt-8 border-b-2 text-5xl font-bold">
          Latest Signals per Instrument
        </h2>
        <p>
          New to the platform?{" "}
          <span className="hover:underline">check our guide</span> for better
          understanding
        </p>
        <SignalsList
          favouriteSignals={favouriteSignals}
          latestSignals={latestSignals}
          preferences={preferences}
        />
      </div>
    </>
  );
}

export default page;
