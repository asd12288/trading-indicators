"use client";

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

export type User = {
  id: string;
  role: string;
  email: string;
  plan: string;
  created_at: string;
};

export const userTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "plan",
    header: "Plan",
  },
  {
    accessorKey: "created_at",
    sortingFn: (a, b, id) =>
      new Date(a.getValue(id)).getTime() - new Date(b.getValue(id)).getTime(),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Join at
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      const formattedDate = format(new Date(date), "dd/MM/yyyy");
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      const proUser = rowData.plan === "pro";

      const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

      async function handleUpgrade(upgrade: boolean) {
        const { data, error } = await supabaseClient
          .from("profiles")
          .update({ plan: upgrade ? "pro" : "free" }) // Change to desired role
          .eq("id", rowData.id);
        if (error) {
          toast({
            title: "Error upgrading user",
            description: error.message,
          });
        } else {
          toast({
            title: `User ${proUser ? "downgraded" : "upgraded"}`,
            description: `User ${rowData.email} has been ${[proUser ? "downgraded" : "upgraded"]}`,
          });
        }
      }

      async function handleReset() {
        const { data, error } = await supabaseClient
          .from("profiles")
          .delete()
          .eq("id", rowData.id);
        if (error) {
          toast({
            title: "Error deleting user",
            description: error.message,
          });
        } else {
          toast({
            title: "User deleted",
            description: `User ${rowData.email} has been deleted`,
          });
        }
      }

      return (
        <>
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
                onClick={() => handleUpgrade(!proUser)}
              >
                {proUser ? "Downgrade" : "Upgrade"} User
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-slate-900"
                onClick={() => setDeleteAlertOpen(true)}
              >
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ConfirmDialog
            open={deleteAlertOpen}
            onOpenChange={setDeleteAlertOpen}
            title="Confirm User Deletion"
            description={`Are you sure you want to delete user ${rowData.email}? This action cannot be undone.`}
            onConfirm={async () => {
              await handleReset();
              setDeleteAlertOpen(false);
            }}
          />
        </>
      );
    },
  },
];
