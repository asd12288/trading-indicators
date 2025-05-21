import { AlertHours } from "@/hooks/useAlertHours";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Save, Clock, Calendar, LayoutGrid, Tag, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

import InstrumentSearch from "./InstrumentSearch";
import DaysSelector from "./DaysSelector";
import InstrumentGroupSelector from "./InstrumentGroupSelector";

interface AlertHourFormProps {
  currentItem: Partial<AlertHours> | null;
  onSubmit: (data: Partial<AlertHours>) => void;
}

const AlertHourForm = ({ currentItem, onSubmit }: AlertHourFormProps) => {
  const theme = "dark";
  const [formData, setFormData] = useState<Partial<AlertHours> | null>(
    currentItem,
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Update form data when currentItem changes
  useEffect(() => {
    setFormData(currentItem);
  }, [currentItem]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Clear validation error for this field if it exists
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData?.instrument?.trim()) {
      errors.instrument = "Instrument is required";
    }

    if (!formData?.instrument_group) {
      errors.instrument_group = "Instrument group is required";
    }

    if (!formData?.start_time_utc) {
      errors.start_time_utc = "Start time is required";
    }

    if (!formData?.end_time_utc) {
      errors.end_time_utc = "End time is required";
    }

    if (!formData?.days_active || formData.days_active.length === 0) {
      errors.days_active = "At least one day must be selected";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) return;

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  if (!formData) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-h-[80vh] space-y-4 overflow-y-auto"
    >
      <DialogHeader className="pb-2">
        <DialogTitle>
          {currentItem?.id ? "Edit Alert Hours" : "Create Alert Hours"}
        </DialogTitle>
        <DialogDescription className={theme === "dark" ? "text-slate-400" : ""}>
          Configure when alerts are active for this instrument.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Instrument Section */}
        <div
          className={cn(
            "rounded-md p-3",
            theme === "dark" ? "bg-slate-800/50" : "bg-slate-50",
          )}
        >
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Tag className="h-4 w-4 text-blue-400" />
            <h3>Instrument Details</h3>
          </div>

          <div className="space-y-3">
            {/* Instrument field */}
            <div className="grid grid-cols-3 items-center gap-2">
              <Label htmlFor="instrument" className="text-right text-sm">
                Instrument
              </Label>
              <div className="col-span-2">
                <InstrumentSearch
                  value={formData.instrument || ""}
                  onChange={(value) => handleChange("instrument", value)}
                />
                {validationErrors.instrument && (
                  <p className="mt-1 text-xs text-red-500">
                    {validationErrors.instrument}
                  </p>
                )}
              </div>
            </div>

            {/* Group and Session in same row */}
            <div className="grid grid-cols-6 items-center gap-2">
              <Label htmlFor="group" className="col-span-1 text-right text-sm">
                Group
              </Label>
              <div className="col-span-2">
                <InstrumentGroupSelector
                  value={formData.instrument_group}
                  onChange={(value) => handleChange("instrument_group", value)}
                />
                {validationErrors.instrument_group && (
                  <p className="mt-1 text-xs text-red-500">
                    {validationErrors.instrument_group}
                  </p>
                )}
              </div>

              <Label htmlFor="session" className="text-right text-sm">
                Session
              </Label>
              <div className="col-span-2 flex items-center">
                <Input
                  id="session"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.session_number || 1}
                  onChange={(e) =>
                    handleChange("session_number", parseInt(e.target.value))
                  }
                  className={cn(
                    "w-full",
                    theme === "dark" ? "border-slate-700 bg-slate-800" : "",
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Time Section */}
        <div
          className={cn(
            "rounded-md p-3",
            theme === "dark" ? "bg-slate-800/50" : "bg-slate-50",
          )}
        >
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4 text-emerald-400" />
            <h3>Session Time (UTC)</h3>
          </div>

          <div className="grid grid-cols-6 items-center gap-2">
            <Label
              htmlFor="start-time"
              className="col-span-1 text-right text-sm"
            >
              Start
            </Label>
            <div className="col-span-2">
              <div
                className={cn(
                  "flex items-center rounded-md p-1.5",
                  theme === "dark"
                    ? "bg-slate-800"
                    : "border border-slate-200 bg-white",
                )}
              >
                <Input
                  id="start-time"
                  type="time"
                  value={formData.start_time_utc?.substring(0, 5) || ""}
                  onChange={(e) =>
                    handleChange("start_time_utc", `${e.target.value}:00`)
                  }
                  className={cn(
                    "border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                    theme === "dark" ? "text-slate-100" : "",
                  )}
                  required
                />
              </div>
              {validationErrors.start_time_utc && (
                <p className="mt-1 text-xs text-red-500">
                  {validationErrors.start_time_utc}
                </p>
              )}
            </div>

            <Label htmlFor="end-time" className="col-span-1 text-right text-sm">
              End
            </Label>
            <div className="col-span-2">
              <div
                className={cn(
                  "flex items-center rounded-md p-1.5",
                  theme === "dark"
                    ? "bg-slate-800"
                    : "border border-slate-200 bg-white",
                )}
              >
                <Input
                  id="end-time"
                  type="time"
                  value={formData.end_time_utc?.substring(0, 5) || ""}
                  onChange={(e) =>
                    handleChange("end_time_utc", `${e.target.value}:00`)
                  }
                  className={cn(
                    "border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                    theme === "dark" ? "text-slate-100" : "",
                  )}
                  required
                />
              </div>
              {validationErrors.end_time_utc && (
                <p className="mt-1 text-xs text-red-500">
                  {validationErrors.end_time_utc}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Days Section */}
        <div
          className={cn(
            "rounded-md p-3",
            theme === "dark" ? "bg-slate-800/50" : "bg-slate-50",
          )}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-violet-400" />
              <h3>Active Days</h3>
            </div>

            {validationErrors.days_active && (
              <p className="text-xs font-medium text-red-500">
                {validationErrors.days_active}
              </p>
            )}
          </div>

          <DaysSelector
            selectedDays={formData.days_active || []}
            onChange={(days) => handleChange("days_active", days)}
          />
        </div>

        {/* Status Section */}
        <div
          className={cn(
            "rounded-md p-3",
            theme === "dark" ? "bg-slate-800/50" : "bg-slate-50",
          )}
        >
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <LayoutGrid className="h-4 w-4 text-amber-400" />
            <h3>Status</h3>
          </div>

          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="active" className="text-right text-sm">
              Active
            </Label>
            <div className="col-span-2 flex items-center gap-3">
              <Switch
                id="active"
                checked={formData.is_active !== false}
                onCheckedChange={(checked) =>
                  handleChange("is_active", checked)
                }
              />
              <span
                className={cn(
                  "text-xs",
                  formData.is_active !== false
                    ? "text-emerald-500"
                    : "text-slate-500",
                )}
              >
                {formData.is_active !== false
                  ? "Alert session active"
                  : "Alert session inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="pt-2">
        <Button type="submit" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AlertHourForm;
