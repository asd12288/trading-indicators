import { DAYS_OF_WEEK } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DaysSelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

const DaysSelector = ({ selectedDays, onChange }: DaysSelectorProps) => {
  const theme = "dark";

  const handleDayToggle = (dayId: number, checked: boolean) => {
    const days = [...selectedDays];

    if (checked) {
      if (!days.includes(dayId)) {
        days.push(dayId);
      }
    } else {
      const index = days.indexOf(dayId);
      if (index !== -1) {
        days.splice(index, 1);
      }
    }

    onChange(days);
  };

  // Quick selection buttons
  const selectWeekdays = () => onChange([1, 2, 3, 4, 5]);
  const selectWeekend = () => onChange([0, 6]);
  const selectAllDays = () => onChange([0, 1, 2, 3, 4, 5, 6]);
  const clearAllDays = () => onChange([]);

  return (
    <div className="space-y-3">
      {/* Visual calendar representation */}
      <div className="flex flex-wrap justify-between gap-2">
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = selectedDays.includes(day.id);

          return (
            <div
              key={day.id}
              className={cn(
                "flex h-9 w-9 cursor-pointer flex-col items-center justify-center rounded-full transition-colors",
                isSelected
                  ? theme === "dark"
                    ? "bg-blue-700/70 text-white"
                    : "bg-blue-100 text-blue-800"
                  : theme === "dark"
                    ? "bg-slate-700 text-slate-400 hover:bg-slate-600"
                    : "bg-slate-200 text-slate-500 hover:bg-slate-300",
              )}
              onClick={() => handleDayToggle(day.id, !isSelected)}
            >
              <span className="text-xs font-medium">
                {day.name.substring(0, 1)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick selection buttons with improved styling */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={selectWeekdays}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-medium transition-colors",
            theme === "dark"
              ? "bg-blue-800/40 text-blue-300 hover:bg-blue-800/60"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200",
          )}
        >
          Mon-Fri
        </button>
        <button
          type="button"
          onClick={selectWeekend}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-medium transition-colors",
            theme === "dark"
              ? "bg-violet-800/40 text-violet-300 hover:bg-violet-800/60"
              : "bg-violet-100 text-violet-800 hover:bg-violet-200",
          )}
        >
          Sat-Sun
        </button>
        <button
          type="button"
          onClick={selectAllDays}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-medium transition-colors",
            theme === "dark"
              ? "bg-emerald-800/40 text-emerald-300 hover:bg-emerald-800/60"
              : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
          )}
        >
          All
        </button>
        <button
          type="button"
          onClick={clearAllDays}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-medium transition-colors",
            theme === "dark"
              ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
              : "bg-slate-200 text-slate-600 hover:bg-slate-300",
          )}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default DaysSelector;
