"use client";

import React from "react";
import supabaseClient from "@/database/supabase/client";
import { Button } from "../ui/button";
import { Check, AlertTriangle, RefreshCw, Bug } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Signal } from "@/lib/types";
import { motion } from "framer-motion";

const SignalDebugTab = () => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [status, setStatus] = React.useState<{
    message: string;
    type: "success" | "error" | "info" | null;
  }>({
    message: "",
    type: null,
  });

  const [allSignals, setAllSignals] = React.useState([]);
  const [latestSignals, setLatestSignals] = React.useState([]);
  const [signalIsLoading, setSignalIsLoading] = React.useState(true);
  const [signalError, setSignalError] = React.useState(null);

  const fetchData = async () => {
    setSignalIsLoading(true);
    try {
      // Fetch from all_signals
      const { data: allData, error: allError } = await supabaseClient
        .from("all_signals")
        .select("*")
        .order("entry_time", { ascending: false });

      if (allError) throw allError;

      // Fetch from latest_signals_per_instrument
      const { data: latestData, error: latestError } = await supabaseClient
        .from("latest_signals_per_instrument")
        .select("*")
        .order("entry_time", { ascending: false });

      if (latestError) throw latestError;

      console.log("All signals count:", allData.length);
      console.log("Latest signals table count:", latestData.length);

      setAllSignals(allData);
      setLatestSignals(latestData);
    } catch (err) {
      setSignalError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setSignalIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Find discrepancies between latest_signals_per_instrument and what should be there
  const missingOrWrongSignals = React.useMemo(() => {
    if (!allSignals.length) return [];

    // Create a map of what latest signals SHOULD be
    const instrumentMap = new Map();
    allSignals.forEach((signal: Signal) => {
      const instrument = signal.instrument_name;
      if (
        !instrumentMap.has(instrument) ||
        new Date(signal.entry_time) >
          new Date(instrumentMap.get(instrument).entry_time)
      ) {
        instrumentMap.set(instrument, signal);
      }
    });

    const correctLatest = Array.from(instrumentMap.values());

    // Find signals in correctLatest that are missing or different in latestSignals
    return correctLatest.filter((correct) => {
      const found = latestSignals.find(
        (s: Signal) => s.instrument_name === correct.instrument_name,
      );
      return (
        !found || new Date(found.entry_time) < new Date(correct.entry_time)
      );
    });
  }, [allSignals, latestSignals]);

  const refreshLatestSignalsTable = async () => {
    setIsRefreshing(true);
    setStatus({ message: "Synchronizing tables...", type: "info" });

    try {
      // This SQL will rebuild the latest signals table with the most recent data
      const query = `
        -- Clear existing data
        TRUNCATE TABLE latest_signals_per_instrument;
        
        -- Insert latest signal per instrument
        WITH latest_per_instrument AS (
          SELECT DISTINCT ON (instrument_name) *
          FROM all_signals
          ORDER BY instrument_name, entry_time DESC
        )
        INSERT INTO latest_signals_per_instrument
        SELECT * FROM latest_per_instrument;
        
        -- Return count for confirmation
        SELECT COUNT(*) FROM latest_signals_per_instrument;
      `;

      const { data, error } = await supabaseClient.rpc("run_sql_query", {
        query,
      });

      if (error) throw error;

      const recordCount = data?.[0]?.count || 0;
      setStatus({
        message: `Synchronization complete! ${recordCount} records refreshed.`,
        type: "success",
      });

      // Refresh the data instead of reloading the page
      fetchData();
    } catch (err) {
      console.error("Error syncing tables:", err);
      setStatus({
        message: `Error: ${err.message || "Failed to synchronize tables"}`,
        type: "error",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-indigo-900/30 p-3">
            <Bug className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Signal Diagnostics</h1>
            <p className="text-slate-400">Debug and fix signal database issues</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-700/50 px-4 py-2 text-sm">
            <span className="font-medium text-slate-300">Running Signals: </span>
            <span className="text-white">
              {allSignals.filter((s: Signal) => s.exit_price === null).length || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-8 rounded-xl border border-slate-700/50 bg-slate-800/80 p-4 shadow-lg">
        <div className="mb-4">
          <Tabs defaultValue="comparison">
            <TabsList>
              <TabsTrigger value="comparison">Table Comparison</TabsTrigger>
              <TabsTrigger value="sync">Sync Tool</TabsTrigger>
              <TabsTrigger value="running">Running Signals</TabsTrigger>
            </TabsList>

            {/* Comparison Tab */}
            <TabsContent value="comparison">
              <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Signal Source Comparison
                </h3>

                {signalIsLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                ) : signalError ? (
                  <div className="rounded-md bg-red-900/20 p-4 text-red-400">
                    Error: {signalError}
                  </div>
                ) : (
                  <>
                    <div className="mb-6 grid grid-cols-2 gap-4">
                      <div className="rounded-md bg-slate-700/40 p-4">
                        <h3 className="mb-2 text-lg font-medium text-blue-400">
                          all_signals
                        </h3>
                        <p className="text-2xl font-bold text-white">
                          {allSignals.length}
                        </p>
                        <p className="text-sm text-slate-400">Total signals</p>
                      </div>

                      <div className="rounded-md bg-slate-700/40 p-4">
                        <h3 className="mb-2 text-lg font-medium text-green-400">
                          latest_signals_per_instrument
                        </h3>
                        <p className="text-2xl font-bold text-white">
                          {latestSignals.length}
                        </p>
                        <p className="text-sm text-slate-400">Latest signals</p>
                      </div>
                    </div>

                    {missingOrWrongSignals.length > 0 && (
                      <div className="mb-6 rounded-md bg-amber-900/20 p-4 text-amber-400">
                        <h3 className="mb-2 text-lg font-medium">
                          Issues Found: {missingOrWrongSignals.length}
                        </h3>
                        <p className="mb-2 text-sm">
                          The following signals are either missing or outdated in
                          the latest_signals_per_instrument table:
                        </p>
                        <div className="max-h-60 overflow-y-auto rounded-md bg-slate-900/50 p-2">
                          <ul className="space-y-2">
                            {missingOrWrongSignals.map((signal) => (
                              <li
                                key={signal.client_trade_id}
                                className="border-b border-slate-700 pb-1 text-xs"
                              >
                                <span className="font-medium">
                                  {signal.instrument_name}
                                </span>{" "}
                                -
                                <span className="ml-1 text-slate-300">
                                  {new Date(signal.entry_time).toLocaleString()}
                                </span>
                                <span className="ml-2 text-xs text-amber-500">
                                  {signal.exit_price === null
                                    ? "(Running)"
                                    : "(Completed)"}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center">
                      <Button
                        onClick={fetchData}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Refresh Data
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            {/* Sync Tool Tab */}
            <TabsContent value="sync">
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Signal Table Synchronization Tool
                </h3>
                <p className="mb-4 text-slate-300">
                  This tool helps fix issues where running signals aren't appearing
                  in your dashboard. Click the button below to synchronize the
                  latest_signals_per_instrument table with the most recent data from
                  all_signals.
                </p>

                {status.type && (
                  <Alert
                    className={`mb-4 ${
                      status.type === "success"
                        ? "border-green-800 bg-green-900/20 text-green-400"
                        : status.type === "error"
                          ? "border-red-800 bg-red-900/20 text-red-400"
                          : "border-blue-800 bg-blue-900/20 text-blue-400"
                    }`}
                  >
                    {status.type === "success" && <Check className="h-4 w-4" />}
                    {status.type === "error" && (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    {status.type === "info" && (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    )}
                    <AlertTitle>
                      {status.type === "success"
                        ? "Success"
                        : status.type === "error"
                          ? "Error"
                          : "Processing"}
                    </AlertTitle>
                    <AlertDescription>{status.message}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-center">
                  <Button
                    onClick={refreshLatestSignalsTable}
                    disabled={isRefreshing}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    {isRefreshing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Synchronizing...
                      </>
                    ) : (
                      "Synchronize Signal Tables"
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Running Signals Tab */}
            <TabsContent value="running">
              <div className="rounded-lg border border-slate-700 bg-slate-800/80 p-4">
                <h3 className="mb-4 text-xl font-medium text-white">
                  Running Signals
                </h3>

                {signalIsLoading ? (
                  <div className="text-slate-300">Loading signals...</div>
                ) : signalError ? (
                  <div className="text-red-400">Error: {signalError}</div>
                ) : (
                  <div className="text-slate-300">
                    <div className="mb-3">
                      <span className="font-medium">Total signals:</span>{" "}
                      {allSignals.length}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-md bg-slate-700/50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-medium text-green-400">
                            Running Signals
                          </h4>
                          <span className="rounded-full bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-400">
                            {
                              allSignals.filter(
                                (s: Signal) => s.exit_price === null,
                              ).length
                            }
                          </span>
                        </div>

                        {allSignals.filter((s: Signal) => s.exit_price === null)
                          .length === 0 ? (
                          <p className="text-sm text-slate-400">
                            No running signals found
                          </p>
                        ) : (
                          <ul className="max-h-40 list-disc space-y-1 overflow-y-auto pl-5 text-sm">
                            {allSignals
                              .filter((s: Signal) => s.exit_price === null)
                              .map((s: Signal) => (
                                <li
                                  key={s.client_trade_id || s.instrument_name}
                                  className="text-slate-300"
                                >
                                  <span className="font-medium">
                                    {s.instrument_name}
                                  </span>
                                  <span className="ml-2 text-xs text-slate-400">
                                    ({new Date(s.entry_time).toLocaleString()})
                                  </span>
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>

                      <div className="rounded-md bg-slate-700/50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-medium text-blue-400">
                            Completed Signals
                          </h4>
                          <span className="rounded-full bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-400">
                            {
                              allSignals.filter(
                                (s: Signal) => s.exit_price !== null,
                              ).length
                            }
                          </span>
                        </div>

                        {allSignals.filter((s: Signal) => s.exit_price !== null)
                          .length === 0 ? (
                          <p className="text-sm text-slate-400">
                            No completed signals found
                          </p>
                        ) : (
                          <ul className="max-h-40 list-disc space-y-1 overflow-y-auto pl-5 text-sm">
                            {allSignals
                              .filter((s: Signal) => s.exit_price !== null)
                              .slice(0, 10)
                              .map((s: Signal) => (
                                <li
                                  key={s.client_trade_id}
                                  className="text-slate-300"
                                >
                                  <span className="font-medium">
                                    {s.instrument_name}
                                  </span>
                                  <span className="ml-2 text-xs text-slate-400">
                                    ({new Date(s.exit_time).toLocaleString()})
                                  </span>
                                </li>
                              ))}
                            {allSignals.filter((s: Signal) => s.exit_price !== null)
                              .length > 10 && (
                              <li className="italic text-slate-400">
                                And{" "}
                                {allSignals.filter(
                                  (s: Signal) => s.exit_price !== null,
                                ).length - 10}{" "}
                                more...
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default SignalDebugTab;
