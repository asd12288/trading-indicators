import { useState, useEffect } from "react";
import { InstrumentInfo } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InstrumentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  initialData: InstrumentInfo;
  onSubmit: (data: InstrumentInfo) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

// Ensure all form fields have string values to avoid controlled/uncontrolled switching
const ensureStringValues = (data: InstrumentInfo): InstrumentInfo => {
  return {
    ...data,
    id: data.id || undefined, // Keep ID as undefined if not present
    instrument_name: data.instrument_name || "",
    full_name: data.full_name || "",
    contract_size: data.contract_size || "",
    tick_size: data.tick_size || "",
    tick_value: data.tick_value || "",
    exchange: data.exchange || "",
    basic_info: data.basic_info || "",
    external_link: data.external_link || "",
    margin_requirement: data.margin_requirement || "",
    trading_hours: data.trading_hours || "",
    volatility_level: data.volatility_level || "",
  };
};

export default function InstrumentForm({
  open,
  onOpenChange,
  title,
  description,
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel,
}: InstrumentFormProps) {
  const { theme } = useTheme();
  // Initialize with string values to avoid controlled/uncontrolled switch
  const [formData, setFormData] = useState<InstrumentInfo>(
    ensureStringValues(initialData),
  );

  // Reset form when initialData changes
  useEffect(() => {
    if (open) {
      // Ensure all fields have string values to prevent controlled/uncontrolled switching
      setFormData(ensureStringValues(initialData));
    }
  }, [initialData, open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-[500px]",
          theme === "dark"
            ? "border-slate-700 bg-slate-900 text-slate-100"
            : "bg-white",
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-slate-100">{title}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">
                Instrument Name
              </label>
              <Input
                name="instrument_name"
                value={formData.instrument_name}
                onChange={handleInputChange}
                placeholder="ES"
                className="mt-1 border-slate-700 bg-slate-800 text-slate-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">
                Full Name
              </label>
              <Input
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="E-mini S&P 500"
                className="mt-1 border-slate-700 bg-slate-800 text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">
                Contract Size
              </label>
              <Input
                name="contract_size"
                value={formData.contract_size}
                onChange={handleInputChange}
                placeholder="$50 x S&P 500 Index"
                className="mt-1 border-slate-700 bg-slate-800 text-slate-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">
                Tick Size
              </label>
              <Input
                name="tick_size"
                value={formData.tick_size}
                onChange={handleInputChange}
                placeholder="0.25"
                className="mt-1 border-slate-700 bg-slate-800 text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">
                Tick Value
              </label>
              <Input
                name="tick_value"
                value={formData.tick_value}
                onChange={handleInputChange}
                placeholder="$12.50"
                className="mt-1 border-slate-700 bg-slate-800 text-slate-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">
                Exchange
              </label>
              <Input
                name="exchange"
                value={formData.exchange}
                onChange={handleInputChange}
                placeholder="CME"
                className="mt-1 border-slate-700 bg-slate-800 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">
              Basic Info
            </label>
            <Textarea
              name="basic_info"
              value={formData.basic_info}
              onChange={handleInputChange}
              placeholder="Brief description of the instrument"
              className="mt-1 min-h-20 border-slate-700 bg-slate-800 text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">
                External Link
              </label>
              <Input
                name="external_link"
                value={formData.external_link}
                onChange={handleInputChange}
                placeholder="https://example.com/instrument"
                className="mt-1 border-slate-700 bg-slate-800 text-slate-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">
                Margin Requirement
              </label>
              <Input
                name="margin_requirement"
                value={formData.margin_requirement}
                onChange={handleInputChange}
                placeholder="≈$10,000"
                className="mt-1 border-slate-700 bg-slate-800 text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">
                Trading Hours
              </label>
              <Input
                name="trading_hours"
                value={formData.trading_hours}
                onChange={handleInputChange}
                placeholder="17:00-16:00 CT"
                className="mt-1 border-slate-700 bg-slate-800 text-slate-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">
                Volatility Level
              </label>
              <Input
                name="volatility_level"
                value={formData.volatility_level}
                onChange={handleInputChange}
                placeholder="Medium"
                className="mt-1 border-slate-700 bg-slate-800 text-slate-200"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save size={16} className="mr-1" /> {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
