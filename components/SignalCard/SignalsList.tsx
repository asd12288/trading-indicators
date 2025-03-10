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
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";
import SignalsDisplay from "../SignalsDisplay";
import SignalDebugDisplay from "../debug/SignalDebugDisplay";

interface SignalsListProps {
  userId: string;
}

const SignalsList = ({ userId }: SignalsListProps) => {
  const { theme } = useTheme();
  // Move all hooks to the top - don't add any hooks after this section
  const t = useTranslations("Signals");
  const [searchedSignal, setSearchedSignal] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    preferences,
    isLoading: isLoadingPrefs,
    error,
    favorites,
  } = usePreferences(userId);
  const { signals, isLoading: isLoadingSignals } = useSignals(preferences);
  const { isPro } = useProfile(userId);

  // Derived state using useMemo
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

  // Instead of early returns, use conditional rendering with content variable
  let content;

  // Adjust the content rendering with theme-aware styling
  if (isLoadingSignals || isLoadingPrefs) {
    content = (
      <div className="space-y-6">
        <div className="flex animate-pulse items-center justify-between rounded-lg bg-slate-800 p-5">
          <div className="h-9 w-56 rounded bg-slate-700"></div>
          <div className="h-9 w-36 rounded bg-slate-700"></div>
        </div>
        <LoaderCards />
      </div>
    );
  } else if (error) {
    content = (
      <Alert
        variant="destructive"
        className={cn(
          "p-6",
          theme === "dark"
            ? "border-red-800 bg-red-950/50 text-red-200"
            : "border-red-300 bg-red-50 text-red-800",
        )}
      >
        <AlertOctagon className="h-5 w-5" />
        <AlertTitle className="text-lg">Error loading signals</AlertTitle>
        <AlertDescription>
          {error}. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  } else {
    content = (
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
            className={cn(
              "rounded-xl border p-5 shadow-md",
              theme === "dark"
                ? "border-slate-700/30 bg-gradient-to-b from-slate-800 to-slate-900"
                : "border-slate-200/80 bg-gradient-to-b from-slate-50 to-white",
            )}
          >
            <FavoriteSignals
              favouriteSignals={favouriteSignals}
              isLoading={isLoadingSignals}
            />
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
            className={cn(
              "rounded-xl p-5 shadow-md",
              theme === "dark"
                ? "bg-slate-900/50"
                : "border border-slate-200/80 bg-white",
            )}
          >
            <div className="mb-4 flex items-center gap-2">
              <Filter
                className={cn(
                  "h-5 w-5",
                  theme === "dark" ? "text-slate-400" : "text-slate-600",
                )}
              />
              <h3
                className={cn(
                  "text-base font-medium",
                  theme === "dark" ? "text-slate-300" : "text-slate-700",
                )}
              >
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
          <div
            className={cn(
              "flex flex-col items-center justify-center rounded-xl p-10 text-center",
              theme === "dark"
                ? "bg-slate-900/50"
                : "border border-slate-200/80 bg-white",
            )}
          >
            <Search
              className={cn(
                "mb-3 h-10 w-10",
                theme === "dark" ? "text-slate-500" : "text-slate-400",
              )}
            />
            <p
              className={cn(
                "text-xl font-medium",
                theme === "dark" ? "text-slate-400" : "text-slate-600",
              )}
            >
              {t("noResult")}
            </p>
            <p
              className={cn(
                "mt-3 text-base",
                theme === "dark" ? "text-slate-500" : "text-slate-500",
              )}
            >
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        )}

        {/* Signal grid */}
        <SignalsGrid signals={displaySignals} isLoading={isLoadingSignals} />

        {/* Footer - if needed */}
        {!isPro && displaySignals.length >= 5 && filteredSignals.length > 5 && (
          <div
            className={cn(
              "mt-4 rounded-lg p-5 text-center",
              theme === "dark" ? "bg-blue-950/30" : "bg-blue-50",
            )}
          >
            <p
              className={cn(
                "text-base",
                theme === "dark" ? "text-slate-300" : "text-slate-700",
              )}
            >
              Viewing 5 of {filteredSignals.length} signals.
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
