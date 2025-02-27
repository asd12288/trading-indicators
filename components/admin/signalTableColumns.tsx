"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import supabaseClient from "@/database/supabase/supabase";
import { toast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "../ConfirmDialog";
import { Button } from "../ui/button";
import EditSignalFrom from "./EditSignalFrom";
import { Signal } from "@/lib/types";



export const signalTableColumns: ColumnDef<Signal>[] = [
  {
    accessorKey: "instrument_name",
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Signals
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "trade_side",
    header: "Trade Side",
  },
  {
    accessorKey: "entry_price",
    header: "Entry Price",
  },
  {
    accessorKey: "entry_time",
    sortingFn: (a, b, id) =>
      new Date(a.getValue(id)).getTime() - new Date(b.getValue(id)).getTime(),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Entry Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),

    cell: ({ row }) => {
      const date = row.getValue("entry_time") as string;
      const formattedDate = format(new Date(date), "dd/MM HH:mm");
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "exit_price",
    header: "Exit Price",
  },
  {
    accessorKey: "exit_time",
    header: "Exit Time",
    cell: ({ row }) => {
      const date = row.getValue("exit_time") as string;
      const formattedDate = format(new Date(date), "dd/MM HH:mm");
      const rowUPdated = formattedDate === null ? "N/A" : formattedDate;
      return <div>{rowUPdated}</div>;
    },
  },
  {
    accessorKey: "mae",
    header: "MAE",
    cell: ({ row }) => {
      const mae = row.getValue("mae") as number;
      const rowUpdated = mae === null ? 0 : mae;
      return <div>{rowUpdated.toFixed(0)}</div>;
    },
  },
  {
    accessorKey: "mfe",
    header: "MFE",
    cell: ({ row }) => {
      const mfe = row.getValue("mfe") as number;
      const rowUpdated = mfe === null ? 0 : mfe;
      return <div>{rowUpdated.toFixed(0)}</div>;
    },
  },
  {
    accessorKey: "result_ticks",
    header: "Result Ticks",
  },
  {
    accessorKey: "trade_duration",
    header: "Trade Duration",
  },
  {
    accessorKey: "take_profit_price",
    header: "Take Profit Price",
  },
  {
    accessorKey: "stop_loss_price",
    header: "Stop Loss Price",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;
      const signalId = rowData?.client_trade_id;
      const [open, setOpen] = useState(false);
      const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

      async function handleDelete() {
        const { error } = await supabaseClient
          .from("all_signals")
          .delete()
          .eq("client_trade_id", signalId);
        if (error) {
          console.log(error);
        }
        toast({
          title: "Signal deleted",
          description: `Signal ${rowData.instrument_name} has been deleted`,
        });
      }

      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-50" />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-slate-900"
                onClick={() => setDeleteAlertOpen(true)}
              >
                Delete Signal
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer hover:bg-slate-900"
                onClick={() => setOpen(true)}
              >
                Edit Signal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ConfirmDialog
            open={deleteAlertOpen}
            onOpenChange={setDeleteAlertOpen}
            onConfirm={async () => {
              await handleDelete();
              setDeleteAlertOpen(false);
            }}
            title="Delete Signal"
            description={`Are you sure you want to delete signal ${rowData.instrument_name}?`}
          />

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full max-w-5xl items-center justify-center bg-slate-800">
              <DialogHeader>
                <DialogTitle>{`Edit Signal ${rowData.instrument_name}`}</DialogTitle>
                <EditSignalFrom
                  data={rowData}
                  signalId={signalId}
                  onFinish={() => setOpen(false)}
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
