import React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface SignalsFiltersProps {
  searchedSignal: string;
  setSearchedSignal: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

const SignalsFilters: React.FC<SignalsFiltersProps> = ({
  searchedSignal,
  setSearchedSignal,
  selectedCategory,
  setSelectedCategory,
}) => {
  const categories = [
    { id: "all", name: "All" },
    { id: "crypto", name: "Crypto" },
    { id: "forex", name: "Forex" },
    { id: "stocks", name: "Stocks" },
    { id: "commodities", name: "Commodities" },
  ];

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search signal..."
          value={searchedSignal}
          onChange={(e) => setSearchedSignal(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-10 pr-3 text-sm text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
            }`}
          >
            {category.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SignalsFilters;
