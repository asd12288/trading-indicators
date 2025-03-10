import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";
import supabaseClient from "@/database/supabase/supabase";
import { Shuffle } from "lucide-react";

interface InstrumentSearchProps {
  value: string;
  onChange: (value: string) => void;
}

interface Instrument {
  name: string;
  fullName: string;
}

const InstrumentSearch = ({ value, onChange }: InstrumentSearchProps) => {
  const { theme } = useTheme();
  const [instrumentList, setInstrumentList] = useState<Instrument[]>([]);
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch instruments for dropdown
  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("instruments_info")
          .select("instrument_name, full_name");
          
        if (error) throw error;
        
        if (data) {
          setInstrumentList(data.map(item => ({
            name: item.instrument_name,
            fullName: item.full_name || item.instrument_name
          })));
        }
      } catch (err) {
        console.error("Error fetching instruments:", err);
        setInstrumentList([]);
      }
    };
    
    fetchInstruments();
  }, []);

  // Generate random instrument ID
  const generateRandomId = () => {
    // Create random instrument code (2-4 letters, sometimes followed by 1-2 digits)
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    // Generate 2-4 random letters
    let id = '';
    const letterLength = Math.floor(Math.random() * 3) + 2; // 2-4 letters
    for (let i = 0; i < letterLength; i++) {
      id += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    // Sometimes add 1-2 digits
    if (Math.random() > 0.5) {
      const numLength = Math.floor(Math.random() * 2) + 1; // 1-2 digits
      for (let i = 0; i < numLength; i++) {
        id += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
    }
    
    onChange(id);
  };

  // Filter instruments based on search
  const filteredInstruments = searchText
    ? instrumentList.filter(instrument => 
        instrument.name.toLowerCase().includes(searchText.toLowerCase()) || 
        instrument.fullName.toLowerCase().includes(searchText.toLowerCase()))
    : [];

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className={cn(
              theme === "dark" ? "bg-slate-800 border-slate-700" : "",
              filteredInstruments.length > 0 && showDropdown ? "rounded-b-none" : ""
            )}
            placeholder="Instrument code"
            required
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            onClick={() => setSearchText(value)}
          />
        </div>
        
        <Button 
          type="button"
          variant="outline" 
          size="icon"
          onClick={generateRandomId}
          title="Generate random ID"
          className={theme === "dark" ? "border-slate-700 hover:bg-slate-700" : ""}
        >
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Dropdown results */}
      {showDropdown && filteredInstruments.length > 0 && (
        <div className={cn(
          "absolute z-10 w-full max-h-36 overflow-y-auto rounded-b-md border-x border-b shadow-lg",
          theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          {filteredInstruments.map((instrument) => (
            <div
              key={instrument.name}
              className={cn(
                "flex cursor-pointer items-center px-3 py-2 text-sm",
                theme === "dark" 
                  ? "hover:bg-slate-700 text-slate-300" 
                  : "hover:bg-slate-100 text-slate-900"
              )}
              onClick={() => {
                onChange(instrument.name);
                setSearchText("");
                setShowDropdown(false);
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="flex flex-col">
                <span className="font-medium">{instrument.name}</span>
                {instrument.fullName !== instrument.name && (
                  <span className="text-xs text-slate-500">{instrument.fullName}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstrumentSearch;
