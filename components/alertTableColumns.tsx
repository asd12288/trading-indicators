"use client";

import { Alert } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";



export const alertTableColumns: ColumnDef<Alert>[] = [
  {
    accessorKey: "instrument_name",
    header: "Instrument Name",
    cell: ({ row }) => {
      const instrumentName = row.getValue("instrument_name") as string;
      return <div className="font-semibold">{instrumentName}</div>;
    },
  },

  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const date = row.getValue("time") as string;
      const formattedDate = format(new Date(date), "dd/MM HH:mm");
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "trade_direction",
    header: "Trade Direction",
  },
  {
    accessorKey: "message",
    header: "Message",
  },

  {
    accessorKey: "favorite",
    header: "Favorite",
  },
];
