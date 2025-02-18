"use client";

import supabaseClient from "@/database/supabase/supabase";
import { toast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ConfirmDialog from "../ConfirmDialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type Blog = {
  id: string;
  title: string;
  content: string;
  subTitle: string;
  imageUrl: string;
  created_at: string;
};

export const blogTableColumns: ColumnDef<Blog, any>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "subTitle",
    header: "Sub Title",
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => {
      const blog = row.original.content.slice(0, 100) + "..."; // Slice safely
      return <p className="text-sm text-gray-400">{blog}</p>;
    },
  },
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => (
      <Image
        src={row.original.imageUrl}
        alt="Blog"
        width={48}
        height={48}
        className="rounded-md object-cover"
      />
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const formattedDate = new Date(
        row.original.created_at,
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <span className="text-sm text-gray-500">{formattedDate}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;
      const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

      async function deletePost() {
        console.log("Deleting post with title:", rowData.id); // Debug log

        const { error, data } = await supabaseClient
          .from("blogs")
          .delete()
          .eq("id", rowData.id);

        if (error) {
          console.log("Delete error:", error);
        } else {
          console.log("Delete response:", data);
          toast({
            title: "Post deleted",
            description: `Post ${rowData.title} has been deleted`,
          });
        }
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
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ConfirmDialog
            open={deleteAlertOpen}
            title="Delete Post"
            description="Are you sure you want to delete this post?"
            onOpenChange={setDeleteAlertOpen}
            onConfirm={async () => {
              await deletePost();
              setDeleteAlertOpen(false);
            }}
          />
        </div>
      );
    },
  },
];
