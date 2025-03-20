import React, { memo, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/instrumentCategories";

interface SignalsFiltersProps {
  searchedSignal: string;
  setSearchedSignal: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

// Optimize with memo to prevent unnecessary rerenders
const SignalsFilters = ({
  searchedSignal,
  setSearchedSignal,
  selectedCategory,
  setSelectedCategory,
}: SignalsFiltersProps) => {
  // Memoize handlers for better performance
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchedSignal(e.target.value);
    },
    [setSearchedSignal],
  );

  // Create category buttons only once
  const categoryButtons = useMemo(() => {
    return CATEGORIES.map((category) => (
      <button
        key={category.value}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
          selectedCategory === category.value
            ? "bg-blue-600 text-white"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }`}
        onClick={() => setSelectedCategory(category.value)}
      >
        {category.label}
      </button>
    ));
  }, [selectedCategory, setSelectedCategory]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Input
          className="h-10 bg-slate-800 px-4 py-2 pl-10 text-white placeholder:text-slate-400"
          type="text"
          placeholder="Search Smart Alerts..."
          value={searchedSignal}
          onChange={handleSearchChange}
        />
        <span className="absolute inset-y-0 left-3 flex items-center">
          <svg
            className="h-5 w-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
      </div>

      {/* category buttons for now disabbled */}

      {/* <div className="flex flex-wrap gap-2">{categoryButtons}</div> */}
    </div>
  );
};

export default SignalsFilters; // Remove memo to eliminate potential nesting issues
