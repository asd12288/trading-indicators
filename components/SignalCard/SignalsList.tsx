"use client";

import usePreferences from "@/hooks/usePreferences";
import useSignals from "@/hooks/useSignals";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import {
  AlertOctagon,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import useSignalFilter from "@/hooks/useSignalFilter";
import useSignalSort from "@/hooks/useSignalSort";
import FavoriteSignals from "../FavoriteSignals";
import UpgradePrompt from "../UpgradePrompt";
import LoaderCards from "../loaders/LoaderCards";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import SignalsGrid from "./SignalGrid";
import SignalsFilters from "./SignalsFilters";
import { useUser } from "@/providers/UserProvider";

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
    isLoading: isLoadingPrefs,
    error,
    favorites,

  } = usePreferences(user?.id);

  const { signals } = useSignals("latest");

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

  // Pagination: display signals per page based on plan (6 for pro, 5 for non-pro)
  const itemsPerPage = isPro ? 6 : 5;
  const totalPages = Math.ceil(sortedSignals.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedSignals = sortedSignals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Signals to display on current page
  const displaySignals = paginatedSignals;

  // Filter favorite signals
  const favouriteSignals = useSignalSort(
    signals?.filter(
      (signal) =>
        favorites.includes(signal.instrument_name) &&
        !removedFavorites.includes(signal.instrument_name),
    ),
  );

  // Determine loading state - we're loading if user or preferences are loading
  const isLoading = userLoading || isLoadingPrefs;

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
          <div className="rounded-xl border border-slate-700/30 bg-gradient-to-b from-slate-800 to-slate-900 p-5 shadow-md">
            <FavoriteSignals
              favouriteSignals={favouriteSignals}
              isLoading={false}
              userId={user?.id ?? ""}
              onFavoriteRemoved={handleFavoriteRemoved}
            />
          </div>
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
              Try adjusting your search or filters to find what you&apos;re
              looking for.
            </p>
          </div>
        )}

        {/* Pagination controls above */}
        {isPro && totalPages > 1 && (
          <div className="mb-4 flex items-center justify-center gap-2">
            <Button
              size="sm"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        <SignalsGrid signals={displaySignals} />
        {/* Pagination controls below */}
        {isPro && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button
              size="sm"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

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
