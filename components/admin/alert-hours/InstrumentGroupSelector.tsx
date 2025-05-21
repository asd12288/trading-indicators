import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INSTRUMENT_GROUPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface InstrumentGroupSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

const InstrumentGroupSelector = ({
  value,
  onChange,
}: InstrumentGroupSelectorProps) => {
  const theme = "dark";

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "w-full",
          theme === "dark" ? "border-slate-700 bg-slate-800" : "",
        )}
      >
        <SelectValue placeholder="Select instrument group" />
      </SelectTrigger>
      <SelectContent
        className={theme === "dark" ? "border-slate-700 bg-slate-900" : ""}
      >
        {INSTRUMENT_GROUPS.map((group) => (
          <SelectItem
            key={group}
            value={group}
            className={theme === "dark" ? "focus:bg-slate-800" : ""}
          >
            {group}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default InstrumentGroupSelector;
