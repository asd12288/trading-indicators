import { ColumnDef } from "@tanstack/react-table";
import { Info, ArrowUp, ArrowDown } from "lucide-react";
import TableInfoToolTip from "./TableInfoToolTip";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type TradesSummary = {
  entry_time: string;
  entry_price: number;
  exit_price: number;
  trade_side: "Long" | "Short";
  trade_duration: string;
  mfe: number | null;
  lossTicks: number | null;
  isForex?: boolean;
  measurementUnit?: string;
  instrument_name: string;
};

export const tradeSummaryColumns: ColumnDef<TradesSummary>[] = [
  {
    accessorKey: "instrument_name",
    header: () => (
      <div className="text-left font-semibold text-slate-50">Instrument</div>
    ),
    cell: ({ row }) => {
      const instrument = row.getValue("instrument_name") as string;
      return <div className="font-medium text-slate-200">{instrument}</div>;
    },
  },
  {
    accessorKey: "entry_time",
    header: () => (
      <div className="text-left font-semibold text-slate-50">Entry Time</div>
    ),
    cell: ({ row }) => {
      const entryTime = row.getValue("entry_time");
      const timeFormatted = format(
        new Date(entryTime as string),
        "dd/MM HH:mm",
      );
      return <div className="text-slate-200">{timeFormatted}</div>;
    },
  },
  {
    accessorKey: "trade_side",
    header: () => (
      <div className="text-left font-semibold text-slate-50">Side</div>
    ),
    cell: ({ row }) => {
      const side = row.getValue("trade_side") as string;
      const isLong = side?.toLowerCase() === "long";

      return (
        <div
          className={cn(
            "flex w-fit items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
            isLong
              ? "border border-emerald-500/30 bg-emerald-900/30 text-emerald-400"
              : "border border-rose-500/30 bg-rose-900/30 text-rose-400",
          )}
        >
          {isLong ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          <span>{side}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "entry_price",
    header: () => (
      <div className="text-left font-semibold text-slate-50">Entry</div>
    ),
    cell: ({ row }) => {
      const price = row.getValue("entry_price") as number;
      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 5,
      }).format(price);

      return <div className="font-mono text-slate-200">{formatted}</div>;
    },
  },
  {
    accessorKey: "exit_price",
    header: () => (
      <div className="text-left font-semibold text-slate-50">Exit</div>
    ),
    cell: ({ row }) => {
      const price = row.getValue("exit_price") as number;
      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 5,
      }).format(price);

      return <div className="font-mono text-slate-200">{formatted}</div>;
    },
  },

  {
    accessorKey: "trade_duration",
    header: () => (
      <div className="text-left font-semibold text-slate-50">Duration</div>
    ),
    cell: ({ row }) => {
      const duration = row.getValue("trade_duration") as string;
      return <div className="text-xs text-slate-300">{duration || "-"}</div>;
    },
  },
  {
    accessorKey: "mfe",
    header: () => (
      <div className="flex items-center gap-2">
        <p className="text-left font-semibold text-slate-50">MFE</p>
        <TableInfoToolTip type={"mfeTicks"}>
          <Info className="h-4 w-4 text-slate-400" />
        </TableInfoToolTip>
      </div>
    ),
    cell: ({ row }) => {
      const mfe = row.getValue("mfe");
      const unit = row.original.measurementUnit || "ticks";
      const mfeFormatted = mfe ? Number(mfe).toFixed(1) : null;

      return (
        <div className="text-lg font-medium text-green-500">
          {mfeFormatted ? `${mfeFormatted} ${unit}` : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "lossTicks",
    header: () => (
      <div className="flex items-center gap-2">
        <p className="text-left font-semibold text-slate-50">Loss</p>
        <TableInfoToolTip type={"lossTicks"}>
          <Info className="h-4 w-4 text-slate-400" />
        </TableInfoToolTip>
      </div>
    ),
    cell: ({ row }) => {
      const lossTicks = row.getValue("lossTicks");
      const unit = row.original.measurementUnit || "ticks";
      const lossFormatted = lossTicks ? Number(lossTicks).toFixed(1) : null;

      return (
        <div className="text-lg text-red-500">
          {lossFormatted && Number(lossFormatted) > 0
            ? `${lossFormatted} ${unit}`
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "more",
    header: "More",
  },
];
