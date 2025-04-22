"use client";

import usePreferences from "@/hooks/usePreferences";
import useSignals from "@/hooks/useSignals";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { AlertOctagon, Filter, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import useSignalFilter from "@/hooks/useSignalFilter";
import useSignalSort from "@/hooks/useSignalSort";
import FavoriteSignals from "../FavoriteSignals";
import UpgradePrompt from "../UpgradePrompt";
import LoaderCards from "../loaders/LoaderCards";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import SignalsGrid from "./SignalGrid";
import SignalsFilters from "./SignalsFilters";
import { useUser } from "@/providers/UserProvider";

// Helper function to determine signal status priority
const getSignalStatusPriority = (signal) => {
  // Running signals (have entry_time but no exit_time)
  if (signal.entry_time && !signal.exit_time) {
    return 1; // Highest priority
  }
  // Fulfilled signals (have both entry_time and exit_time)
  else if (signal.entry_time && signal.exit_time) {
    return 2; // Medium priority
  }
  // Market closed signals (default to lowest priority)
  else {
    return 3; // Lowest priority
  }
};

const SignalsList = () => {
  const t = useTranslations("Signals");
  const [searchedSignal, setSearchedSignal] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get user data including isPro status from the UserProvider
  const { user, isPro, loading: userLoading } = useUser();

  // Track locally removed favorites
  const [removedFavorites, setRemovedFavorites] = useState<string[]>([]);

  // Only pass userId to hooks if we have one
  const {
    preferences,
    isLoading: isLoadingPrefs,
    error,
    favorites,
  } = usePreferences(user?.id);

  const { signals, isLoading: isLoadingSignals } = useSignals(preferences);

  // Handle favorite removal to update UI immediately
  const handleFavoriteRemoved = useCallback((instrumentName: string) => {
    setRemovedFavorites((prev) => [...prev, instrumentName]);
  }, []);

  // Filter and sort signals via custom hooks
  const filteredSignals = useSignalFilter(signals, {
    search: searchedSignal,
    category: selectedCategory,
  });
  const sortedSignals = useSignalSort(filteredSignals);

  // Only limit signals for non-pro users
  const displaySignals = isPro ? sortedSignals : sortedSignals.slice(0, 5);

  // Filter favorite signals
  const favouriteSignals = useSignalSort(
    signals?.filter(
      (signal) =>
        favorites.includes(signal.instrument_name) &&
        !removedFavorites.includes(signal.instrument_name),
    ),
  );

  // Determine loading state - we're loading if either user or preferences are loading
  const isLoading = userLoading || isLoadingSignals || isLoadingPrefs;

  // Use conditional rendering with content variable
  let content;

  // Show loading state
  if (isLoading) {
    content = (
      <div className="space-y-6">
        <div className="flex animate-pulse items-center justify-between rounded-lg bg-slate-800 p-5">
          <div className="h-9 w-56 rounded bg-slate-700"></div>
          <div className="h-9 w-36 rounded bg-slate-700"></div>
        </div>
        <LoaderCards />
      </div>
    );
  }
  // Show error state
  else if (error) {
    content = (
      <Alert
        variant="destructive"
        className="border-red-800 bg-red-950/50 p-6 text-red-200"
      >
        <AlertOctagon className="h-5 w-5" />
        <AlertTitle className="text-lg">Error loading signals</AlertTitle>
        <AlertDescription>
          {error}. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }
  // Show content state
  else {
    content = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-8 p-0 backdrop-blur-sm"
      >
        {/* Favorites section - only show if user is pro and has favorites */}
        {isPro && favouriteSignals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-slate-700/30 bg-gradient-to-b from-slate-800 to-slate-900 p-5 shadow-md"
          >
            <FavoriteSignals
              favouriteSignals={favouriteSignals}
              isLoading={isLoadingSignals}
              userId={user?.id}
              onFavoriteRemoved={handleFavoriteRemoved}
            />
          </motion.div>
        )}

        {/* PRO upgrade prompt - only show for non-pro users */}
        {!isPro && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <UpgradePrompt />
          </motion.div>
        )}

        {/* Filters section - only show for pro users */}
        {isPro && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl bg-slate-900/50 p-5 shadow-md"
          >
            <div className="mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5 text-slate-400" />
              <h3 className="text-base font-medium text-slate-300">
                Filter Signals
              </h3>
            </div>
            <SignalsFilters
              searchedSignal={searchedSignal}
              setSearchedSignal={setSearchedSignal}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </motion.div>
        )}

        {/* No results message */}
        {displaySignals && displaySignals.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl bg-slate-900/50 p-10 text-center">
            <Search className="mb-3 h-10 w-10 text-slate-500" />
            <p className="text-xl font-medium text-slate-400">
              {t("noResult")}
            </p>
            <p className="mt-3 text-base text-slate-500">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        )}

        {/* Signal grid */}
        <SignalsGrid signals={displaySignals} isLoading={isLoadingSignals} />

        {/* Footer - if needed */}
        {!isPro && displaySignals.length >= 5 && sortedSignals.length > 5 && (
          <div className="mt-4 rounded-lg bg-blue-950/30 p-5 text-center">
            <p className="text-base text-slate-300">
              Viewing 5 of {sortedSignals.length} signals.
              <Link
                href="/profile?tab=upgrade"
                className="ml-2 font-medium text-blue-500 hover:underline"
              >
                Upgrade to PRO
              </Link>{" "}
              to see all signals.
            </p>
          </div>
        )}
      </motion.div>
    );
  }

  // Always return content at the end
  return content;
};

export default SignalsList;
