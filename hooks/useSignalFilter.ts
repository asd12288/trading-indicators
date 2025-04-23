// New hook to filter signals based on search and category
import { useMemo } from "react";
import { instrumentCategoryMap } from "@/lib/instrumentCategories";
import { Signal } from "@/lib/types";

type FilterOptions = {
  search: string;
  category: string;
};

const useSignalFilter = (
  signals: Signal[] | undefined,
  { search, category }: FilterOptions,
) => {
  return useMemo(() => {
    if (!Array.isArray(signals)) return [];

    return signals.filter((signal) => {
      const name = signal.instrument_name?.toLowerCase() || "";
      const signalCategory =
        instrumentCategoryMap[signal.instrument_name] || "unknown";
      const matchesCategory =
        category === "all" ? true : signalCategory === category;
      const matchesSearch =
        !search.trim() || name.includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [signals, search, category]);
};

export default useSignalFilter;
