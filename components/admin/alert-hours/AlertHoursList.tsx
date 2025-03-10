import { AlertHours } from "@/hooks/useAlertHours";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Clock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";
import supabaseClient from "@/database/supabase/supabase";
import { useState } from "react";

interface AlertHoursListProps {
  alertHours: AlertHours[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onEdit: (item: AlertHours) => void;
  onDelete: (id: string) => void;
}

const AlertHoursList = ({
  alertHours,
  searchTerm,
  setSearchTerm,
  onEdit,
  onDelete,
}: AlertHoursListProps) => {
  const { theme } = useTheme();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleStatusChange = async (id: string, checked: boolean) => {
    setUpdatingStatus(id);
    try {
      await supabaseClient
        .from("alert_hours")
        .update({ is_active: checked })
        .eq("id", id);
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center">
        <Search className="mr-2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search instruments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div
        className={cn(
          "relative overflow-x-auto rounded-md border",
          theme === "dark" ? "border-slate-700" : "border-slate-200",
        )}
      >
        <Table>
          <TableHeader>
            <TableRow
              className={
                theme === "dark" ? "bg-slate-800 hover:bg-slate-800" : ""
              }
            >
              <TableHead className={theme === "dark" ? "text-slate-100" : ""}>
                Instrument
              </TableHead>
              <TableHead className={theme === "dark" ? "text-slate-100" : ""}>
                Group
              </TableHead>
              <TableHead className={theme === "dark" ? "text-slate-100" : ""}>
                Session
              </TableHead>
              <TableHead className={theme === "dark" ? "text-slate-100" : ""}>
                Time (UTC)
              </TableHead>
              <TableHead className={theme === "dark" ? "text-slate-100" : ""}>
                Days
              </TableHead>
              <TableHead className={theme === "dark" ? "text-slate-100" : ""}>
                Active
              </TableHead>
              <TableHead
                className={cn(
                  "text-right",
                  theme === "dark" ? "text-slate-100" : "",
                )}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={theme === "dark" ? "bg-slate-900" : "bg-white"}>
            {alertHours.length === 0 ? (
              <TableRow
                className={theme === "dark" ? "hover:bg-slate-800" : ""}
              >
                <TableCell
                  colSpan={7}
                  className={cn(
                    "p-8 text-center",
                    theme === "dark" ? "text-slate-400" : "text-slate-500",
                  )}
                >
                  {searchTerm
                    ? "No matching alert hours found."
                    : 'No alert hours configured. Click "Add New" to create one.'}
                </TableCell>
              </TableRow>
            ) : (
              alertHours.map((item) => (
                <TableRow
                  key={item.id}
                  className={
                    theme === "dark"
                      ? "border-slate-800 hover:bg-slate-800"
                      : ""
                  }
                >
                  <TableCell
                    className={cn(
                      "font-medium",
                      theme === "dark" ? "text-slate-200" : "",
                    )}
                  >
                    {item.instrument}
                  </TableCell>
                  <TableCell
                    className={theme === "dark" ? "text-slate-300" : ""}
                  >
                    {item.instrument_group}
                  </TableCell>
                  <TableCell
                    className={theme === "dark" ? "text-slate-300" : ""}
                  >
                    {item.session_number}
                  </TableCell>
                  <TableCell
                    className={theme === "dark" ? "text-slate-300" : ""}
                  >
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3.5 w-3.5 text-blue-400" />
                      {item.start_time_utc.substring(0, 5)} -{" "}
                      {item.end_time_utc.substring(0, 5)}
                    </span>
                  </TableCell>
                  <TableCell
                    className={theme === "dark" ? "text-slate-300" : ""}
                  >
                    {item.days_active
                      .map(
                        (day) =>
                          ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][day],
                      )
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={item.is_active}
                      disabled={updatingStatus === item.id}
                      onCheckedChange={(checked) => {
                        handleStatusChange(item.id, checked);
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        onClick={() => onEdit(item)}
                        className={
                          theme === "dark"
                            ? "border-slate-700 hover:bg-slate-700"
                            : ""
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default AlertHoursList;
