"use client";

import { format } from "date-fns";
import { TrendingUp, TrendingDown, Clock, AlertCircle } from "lucide-react";

export const alertTableColumns = [
  {
    accessorKey: "instrument_name",
    header: "Instrument",
    cell: ({ row }) => {
      const instrument = row.original.instrument_name;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{instrument}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "trade_direction",
    header: "Direction",
    cell: ({ row }) => {
      const isLong = row.original.trade_direction === "LONG";
      return (
        <div
          className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
            isLong
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {isLong ? (
            <>
              <TrendingUp className="h-3 w-3" />
              <span>Long</span>
            </>
          ) : (
            <>
              <TrendingDown className="h-3 w-3" />
              <span>Short</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.original.price;
      const isLong = row.original.trade_direction === "LONG";
      return (
        <div className="font-mono">
          <span className={isLong ? "text-green-400" : "text-red-400"}>
            {typeof price === "number" ? price.toFixed(2) : price}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "time_utc",
    header: "Time",
    cell: ({ row }) => {
      const time = row.original.time_utc || row.original.time;
      return (
        <div className="flex items-center gap-1 text-slate-400">
          <Clock className="h-3 w-3" />
          <span>{time ? format(new Date(time), "MMM d, HH:mm") : "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type || "Price Level";
      const priority = row.original.priority || "medium";

      const getBgColor = () => {
        switch (type) {
          case "Price Level":
            return "bg-blue-500/20 text-blue-400";
          case "Trend Change":
            return "bg-purple-500/20 text-purple-400";
          case "Volatility":
            return "bg-amber-500/20 text-amber-400";
          default:
            return "bg-slate-500/20 text-slate-400";
        }
      };

      return (
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-2 py-0.5 text-xs ${getBgColor()}`}>
            {type}
          </span>

          {priority === "high" && (
            <AlertCircle
              className="h-3 w-3 text-red-400"
              title="High Priority"
            />
          )}
        </div>
      );
    },
  },
];
