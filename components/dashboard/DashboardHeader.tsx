import React from "react";
import { cn } from "@/lib/utils";
import {
  PanelTop,
  LayoutGrid,
  Table2,
  Grip,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  count: number;
  layout: "grid" | "list";
  setLayout: (layout: "grid" | "list") => void;
  columns: 2 | 3 | 4;
  setColumns: (columns: 2 | 3 | 4) => void;
  sortOption: string;
  setSortOption: (option: any) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
  count,
  layout,
  setLayout,
  columns,
  setColumns,
  sortOption,
  setSortOption,
}) => {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      {/* Dashboard header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-600/30">
          <PanelTop className="h-5 w-5 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {description && (
            <p className="text-sm text-slate-400">{description}</p>
          )}
        </div>
        <Badge className="ml-2 bg-yellow-500/20 text-yellow-200">{count}</Badge>
      </div>

      <div className="flex items-center gap-2">
        {/* Layout switcher */}
        <div className="hidden rounded-md bg-slate-800 p-1 sm:flex">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 rounded-md p-0",
              layout === "grid" ? "bg-slate-700" : "hover:bg-slate-700/50",
            )}
            onClick={() => setLayout("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 rounded-md p-0",
              layout === "list" ? "bg-slate-700" : "hover:bg-slate-700/50",
            )}
            onClick={() => setLayout("list")}
          >
            <Table2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Column selector - only visible in grid mode */}
        {layout === "grid" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-slate-700 bg-slate-800/70 text-xs hover:bg-slate-700"
              >
                <Grip className="mr-1 h-3.5 w-3.5" />
                {columns} columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-slate-800 text-slate-200"
            >
              <DropdownMenuLabel className="text-xs text-slate-400">
                Grid layout
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              {[2, 3, 4].map((col) => (
                <DropdownMenuItem
                  key={col}
                  onClick={() => setColumns(col as 2 | 3 | 4)}
                  className={cn(
                    columns === col ? "bg-slate-700" : "",
                    "hover:bg-slate-700",
                  )}
                >
                  {col} columns
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-slate-700 bg-slate-800/70 text-xs hover:bg-slate-700"
            >
              <SlidersHorizontal className="mr-1 h-3.5 w-3.5" />
              {sortOption === "time"
                ? "Recent"
                : sortOption === "name"
                  ? "Name"
                  : sortOption === "status"
                    ? "Status"
                    : "Performance"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-slate-800 text-slate-200"
          >
            <DropdownMenuLabel className="text-xs text-slate-400">
              Sort by
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem
              onClick={() => setSortOption("status")}
              className={cn(
                sortOption === "status" ? "bg-slate-700" : "",
                "hover:bg-slate-700",
              )}
            >
              Status
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortOption("time")}
              className="hover:bg-slate-700"
            >
              Recent
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortOption("name")}
              className="hover:bg-slate-700"
            >
              Name
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortOption("performance")}
              className="hover:bg-slate-700"
            >
              Performance
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardHeader;
