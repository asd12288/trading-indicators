"use client";

import usePreferences from "@/hooks/usePreferences";
import useProfile from "@/hooks/useProfile";
import useSignals from "@/hooks/useSignals";
import { instrumentCategoryMap } from "@/lib/instrumentCategories";
import { useMemo, useState } from "react";
import FavoriteSignals from "../FavoriteSignals";
import LoaderCards from "../loaders/LoaderCards";
import SignalsFilters from "./SignalsFilters";
import UpgradePrompt from "../UpgradePrompt";
import SignalsGrid from "./SignalGrid";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Search, Filter, AlertOctagon } from "lucide-react";
import { Link } from "@/i18n/routing";

interface SignalsListProps {
  userId: string;
}

const SignalsList = ({ userId }: SignalsListProps) => {
  const {
    preferences,
    isLoading: isLoadingPrefs,
    error,
    favorites,
  } = usePreferences(userId);
  const { signals, isLoading: isLoadingSignals } = useSignals(preferences);
  const { isPro } = useProfile(userId);

  const [searchedSignal, setSearchedSignal] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const t = useTranslations("Signals");

  const filteredSignals = useMemo(() => {
    if (!signals) return [];

    return signals.filter((signal) => {
      const name = signal.instrument_name?.toLowerCase() || "";
      const category =
        instrumentCategoryMap[signal.instrument_name] || "unknown";
      const matchesCategory =
        selectedCategory === "all" ? true : category === selectedCategory;
      const matchesSearch =
        searchedSignal.trim() === ""
          ? true
          : name.includes(searchedSignal.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [signals, searchedSignal, selectedCategory]);

  const displaySignals = isPro ? filteredSignals : filteredSignals.slice(0, 5);
  const favouriteSignals =
    signals?.filter((signal) => favorites.includes(signal.instrument_name)) ??
    [];

  // Loading state
  if (isLoadingSignals || isLoadingPrefs) {
    return (
      <div className="space-y-6">
        <div className="flex animate-pulse items-center justify-between rounded-lg bg-slate-800 p-5">
          <div className="h-9 w-56 rounded bg-slate-700"></div>
          <div className="h-9 w-36 rounded bg-slate-700"></div>
        </div>
        <LoaderCards />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 p-0 backdrop-blur-sm"
    >
      {/* Favorites section */}
      {isPro && favouriteSignals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-slate-700/30 bg-gradient-to-b from-slate-800 to-slate-900 p-5 shadow-md"
        >
          <FavoriteSignals favouriteSignals={favouriteSignals} />
        </motion.div>
      )}

      {/* PRO upgrade prompt */}
      {!isPro && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <UpgradePrompt />
        </motion.div>
      )}

      {/* Filters section with animation */}
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
          <p className="text-xl font-medium text-slate-400">{t("noResult")}</p>
          <p className="mt-3 text-base text-slate-500">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
        </div>
      )}

      {/* Signal grid */}
      <SignalsGrid signals={displaySignals} />

      {/* Footer - if needed */}
      {!isPro && displaySignals.length >= 5 && (
        <div className="mt-4 rounded-lg bg-blue-950/30 p-5 text-center">
          <p className="text-base text-slate-300">
            Viewing 5 of {filteredSignals.length} signals.
            <Link
              href="/pricing"
              className="ml-2 font-medium text-blue-400 hover:underline"
            >
              Upgrade to PRO
            </Link>{" "}
            to see all signals.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default SignalsList;
