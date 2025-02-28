import { ColumnDef } from "@tanstack/react-table";
import { Info } from "lucide-react";
import TableInfoToolTip from "./TableInfoToolTip";
import { format } from "date-fns";

export type TradesSummary = {
  entry_time: string;
  entry_price: number;
  exit_price: number;
  tradeSide: "Long" | "Short";
  trade_duration: string;
  mfe: number | null;
  lossTicks: number | null;
};

export const tradeSummaryColumns: ColumnDef<TradesSummary>[] = [
  {
    accessorKey: "entry_time",
    header: () => (
      <div className="text-left font-semibold text-slate-50">Entry Time</div>
    ),
    cell: ({ row }) => {
      const entryTime = row.getValue("entry_time");
      const timeFormated = format(new Date(entryTime), "dd/MM HH:mm");
      return <div className="text-left text-slate-100">{timeFormated}</div>;
    },
  },
  {
    accessorKey: "entry_price",
    header: () => (
      <div className="text-left font-semibold text-slate-50">Entry Price</div>
    ),
  },
  {
    accessorKey: "exit_price",
    header: () => (
      <div className="text-left font-semibold text-slate-50">Exit Price</div>
    ),
  },
  {
    accessorKey: "trade_side",
    header: () => (
      <div className="text-left font-semibold text-slate-50">Trade Side</div>
    ),
  },
  {
    accessorKey: "trade_duration",
    header: () => (
      <div className="text-left font-semibold text-slate-50">
        Trade Duration
      </div>
    ),
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
      const mfeRounded = mfe ? mfe.toFixed(0) : null;

      return (
        <div className="text-lg font-medium text-green-500">
          {mfeRounded ? mfeRounded : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "lossTicks",
    header: () => (
      <div className="flex items-center gap-2">
        <p className="text-left font-semibold text-slate-50">Loss Ticks</p>
        <TableInfoToolTip type={"lossTicks"}>
          <Info className="h-4 w-4 text-slate-400" />
        </TableInfoToolTip>
      </div>
    ),
    cell: ({ row }) => {
      const lossTicks = row.getValue("lossTicks");
      const lossTicksRounded = lossTicks ? lossTicks.toFixed(0) : null;

      return (
        <div className="text-lg text-red-500">
          {lossTicksRounded ? lossTicksRounded : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "more",
    header: "More",
  },
];
