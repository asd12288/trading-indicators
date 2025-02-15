import { createClient } from "@/database/supabase/server";
import { redirect } from "next/navigation";

export async function fetchSignalsData() {
  const supabase = await createClient();

  // Fetch signals
  const { data: signals, error: signalErrors } = await supabase
    .from("all_signals")
    .select("*")
    .order("entry_time", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (signalErrors || !signals) {
    throw new Error("Error fetching signals");
  }

  // Get the latest signal per instrument
  const latestByInstrument = new Map();
  for (const signal of signals) {
    if (!latestByInstrument.has(signal.instrument_name)) {
      latestByInstrument.set(signal.instrument_name, signal);
    }
  }
  const latestSignals = [...latestByInstrument.values()];

  const totalInstruments = latestSignals.length;

  // Fetch profile preferences
  const { data, error } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error("Error fetching profiles");
  }
  const { preferences } = data;

  // Compute favourite signals
  const favouriteSignalNames = Object.keys(preferences).filter(
    (instrument) => preferences[instrument].favorite,
  );
  const favouriteSignals = latestSignals.filter((signal) =>
    favouriteSignalNames.includes(signal.instrument_name),
  );

  return { latestSignals, favouriteSignals, preferences, totalInstruments };
}

export async function fetchSignalDetailData(signalId: string) {
  const supabase = await createClient();

  // Ensure the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch profile preferences
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", user.id)
    .single();
  if (profileError) {
    throw new Error("Error fetching profile data");
  }
  const { preferences } = profileData;

  // Fetch the latest signal for this instrument
  const { data: lastSignal, error: lastSignalError } = await supabase
    .from("all_signals")
    .select("*")
    .eq("instrument_name", signalId)
    .order("entry_time", { ascending: false })
    .limit(1)
    .single();
  if (lastSignalError) {
    throw new Error("Error fetching last signal");
  }

  // Fetch last 50 signals for this instrument (for charts, tables, etc.)
  const { data: allSignals, error: allSignalsError } = await supabase
    .from("all_signals")
    .select("*")
    .eq("instrument_name", signalId)
    .order("entry_time", { ascending: false })
    .limit(50);
  if (allSignalsError) {
    throw new Error("Error fetching signals");
  }

  return { lastSignal, allSignals, preferences, user };
}
