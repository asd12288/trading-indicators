"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import useSignals from "@/hooks/useSignals";
import usePreferences from "@/hooks/usePreferences";
import useProfile from "@/hooks/useProfile";
import LoaderCards from "../loaders/LoaderCards";
import SignalCard from "./SignalCard";
import FavoriteSignals from "../FavoriteSignals";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { CATEGORIES, instrumentCategoryMap } from "@/lib/instrumentCategories";

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

  // 1) Filter signals by the typed search and the top-level category
  const filteredSignals = useMemo(() => {
    if (!signals) return [];

    return signals.filter((signal) => {
      const name = signal.instrument_name?.toLowerCase() || "";
      const category =
        instrumentCategoryMap[signal.instrument_name] || "unknown";

      // Check category condition
      const matchesCategory =
        selectedCategory === "all" ? true : category === selectedCategory;

      // Check search condition
      const matchesSearch =
        searchedSignal.trim() === ""
          ? true
          : name.includes(searchedSignal.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [signals, searchedSignal, selectedCategory]);

  // 2) For non-pro users, limit the number of signals
  const displaySignals = isPro ? filteredSignals : filteredSignals.slice(0, 5);

  // 3) Favorite signals (Pro only)
  const favouriteSignals = signals
    ? signals.filter((signal) => favorites.includes(signal.instrument_name))
    : [];

  // If signals are still loading, show loader
  if (isLoadingSignals || isLoadingPrefs) {
    return <LoaderCards />;
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  return (
    <div className="mt-3 rounded-lg bg-slate-800 p-0 md:p-8">
      {/* Show favorites section if Pro and there are any favorites */}
      {isPro && favouriteSignals.length > 0 && (
        <FavoriteSignals favouriteSignals={favouriteSignals} />
      )}

      {!isPro && (
        <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
          <p className="text-center text-gray-400">
            Upgrade to view all signals and add favorites.
          </p>
          <Link href="/profile?tab=upgrade">
            <button className="rounded-lg bg-green-800 p-2">Upgrade now</button>
          </Link>
        </div>
      )}

      {isPro && (
        <div className="mb-5 flex flex-col items-center gap-8 px-8 md:flex-row md:justify-between">
          <Input
            placeholder="Search for signals..."
            value={searchedSignal}
            onChange={(e) => setSearchedSignal(e.target.value)}
            className="w-full md:w-[400px]"
          />
          <div className="w-full md:w-[200px]">
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800">
                {CATEGORIES.map((cat) => (
                  <SelectItem
                    key={cat.value}
                    className="cursor-pointer hover:bg-slate-700"
                    value={cat.value}
                  >
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {displaySignals && displaySignals.length === 0 && (
        <div className="flex flex-col items-center justify-center p-4 md:max-w-[1000px]">
          <p className="mt-10 text-center text-lg text-gray-400">
            No signals found. Try a different search or category.
          </p>
        </div>
      )}

      {/* Render filtered signals */}
      <div className="md:grid-col-2 grid gap-4 rounded-lg bg-slate-800 md:min-h-[500px] md:min-w-[1000px] md:gap-8 md:p-8 lg:grid-cols-3">
        {displaySignals.map((signal, index) => (
          <Link
            className="flex justify-center"
            key={`${signal.instrument_name}-${index}`}
            href={`/signals/${signal.instrument_name}`}
          >
            <SignalCard signalPassed={signal} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SignalsList;
