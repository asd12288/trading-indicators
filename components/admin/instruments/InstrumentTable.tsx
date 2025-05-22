import { InstrumentInfo } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";

interface InstrumentTableProps {
  instruments: InstrumentInfo[];
  onEdit: (instrument: InstrumentInfo) => void;
  onDelete: (instrument: InstrumentInfo) => void;
  loading?: boolean;
}

export default function InstrumentTable({
  instruments,
  onEdit,
  onDelete,
  loading = false,
}: InstrumentTableProps) {
  const { theme } = useTheme();

  return (
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
              Full Name
            </TableHead>
            <TableHead className={theme === "dark" ? "text-slate-100" : ""}>
              Contract Size
            </TableHead>
            <TableHead className={theme === "dark" ? "text-slate-100" : ""}>
              Tick Size
            </TableHead>
            <TableHead className={theme === "dark" ? "text-slate-100" : ""}>
              Tick Value
            </TableHead>
            <TableHead className={theme === "dark" ? "text-slate-100" : ""}>
              Exchange
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
          {instruments.length === 0 ? (
            <TableRow className={theme === "dark" ? "hover:bg-slate-800" : ""}>
              <TableCell
                colSpan={7}
                className={cn(
                  "p-8 text-center",
                  theme === "dark" ? "text-slate-400" : "text-slate-500",
                )}
              >
                No instrument data found
              </TableCell>
            </TableRow>
          ) : (
            instruments.map((instrument) => (
              <TableRow
                key={
                  instrument.id
                    ? instrument.id.toString()
                    : `temp-${instrument.instrument_name}`
                }
                className={
                  theme === "dark" ? "border-slate-800 hover:bg-slate-800" : ""
                }
              >
                <TableCell
                  className={cn(
                    "font-medium",
                    theme === "dark" ? "text-slate-200" : "",
                  )}
                >
                  {instrument.instrument_name}
                </TableCell>
                <TableCell className={theme === "dark" ? "text-slate-300" : ""}>
                  {instrument.full_name}
                </TableCell>
                <TableCell className={theme === "dark" ? "text-slate-300" : ""}>
                  {instrument.contract_size}
                </TableCell>
                <TableCell className={theme === "dark" ? "text-slate-300" : ""}>
                  {instrument.tick_size}
                </TableCell>
                <TableCell className={theme === "dark" ? "text-slate-300" : ""}>
                  {instrument.tick_value}
                </TableCell>
                <TableCell className={theme === "dark" ? "text-slate-300" : ""}>
                  {instrument.exchange}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      onClick={() => onEdit(instrument)}
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
                      onClick={() => onDelete(instrument)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {loading && instruments.length > 0 && (
        <div className="flex justify-center bg-slate-900/50 py-4">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        </div>
      )}
    </div>
  );
}
