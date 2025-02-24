import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CATEGORIES } from "@/lib/instrumentCategories";

interface SignalsFiltersProps {
  searchedSignal: string;
  setSearchedSignal: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

const SignalsFilters = ({
  searchedSignal,
  setSearchedSignal,
  selectedCategory,
  setSelectedCategory,
}: SignalsFiltersProps) => {
  return (
    <div className="mb-5 flex flex-col items-center gap-8 px-8 md:flex-row md:justify-between">
      <Input
        placeholder="Search for signals..."
        value={searchedSignal}
        onChange={(e) => setSearchedSignal(e.target.value)}
        className="w-full md:w-[400px]"
      />
      <div className="flex gap-4">
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
    </div>
  );
};

export default SignalsFilters;