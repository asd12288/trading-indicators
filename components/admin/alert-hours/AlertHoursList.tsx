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
import { Trash2, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import supabaseClient from "@/database/supabase/supabase";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const theme = "dark";
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Pagination calculation
  const totalPages = Math.ceil(alertHours.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = alertHours.slice(startIndex, endIndex);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
                theme === "dark" ? "bg-slate-700 hover:bg-slate-800" : ""
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
              currentItems.map((item) => (
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

      {/* Pagination Controls */}
      {alertHours.length > 0 && (
        <div
          className={cn(
            "mt-4 flex items-center justify-between py-2",
            theme === "dark" ? "text-slate-300" : "text-slate-600",
          )}
        >
          <div className="flex items-center gap-2">
            <p className="text-sm">Items per page:</p>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <p className="text-sm">
              Page {currentPage} of {Math.max(1, totalPages)}
            </p>
            <div className="flex items-center">
              <Button
                
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={cn(
                  "h-8 w-8 p-0",
                  theme === "dark" ? "border-slate-700 hover:bg-slate-700" : "",
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
              
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className={cn(
                  "ml-2 h-8 w-8 p-0",
                  theme === "dark" ? "border-slate-700 hover:bg-slate-700" : "",
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertHoursList;
