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

  if (isLoadingSignals || isLoadingPrefs) {
    return <LoaderCards />;
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  return (
    <div className="mt-3 rounded-lg bg-slate-800 p-0 md:p-8">
      {isPro && favouriteSignals.length > 0 && (
        <FavoriteSignals favouriteSignals={favouriteSignals} />
      )}

      {!isPro && <UpgradePrompt />}

      {isPro && (
        <SignalsFilters
          searchedSignal={searchedSignal}
          setSearchedSignal={setSearchedSignal}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}

      {displaySignals && displaySignals.length === 0 && (
        <div className="flex flex-col items-center justify-center p-4 md:max-w-[1000px]">
          <p className="mt-10 text-center text-lg text-gray-400">
            {t("noResult")}
          </p>
        </div>
      )}

      <SignalsGrid signals={displaySignals} />
    </div>
  );
};

export default SignalsList;
