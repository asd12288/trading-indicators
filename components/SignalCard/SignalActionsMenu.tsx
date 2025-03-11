import React from "react";
import { Star, Maximize2, Settings } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

interface SignalActionsMenuProps {
  instrumentName: string;
  isFavorite: boolean;
  onToggleFavorite: (instrumentName: string) => void;
  onViewDetails: (instrumentName: string) => void;
  className?: string;
}

const SignalActionsMenu: React.FC<SignalActionsMenuProps> = ({
  instrumentName,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  className = "",
}) => {
  // Prevent event propagation to parent links
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      className={`opacity-0 transition-opacity group-hover:opacity-100 ${className}`}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={handleMenuClick}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full bg-slate-800/70 p-0"
          >
            <Settings className="h-4 w-4 text-slate-300" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-slate-800 text-slate-200"
        >
          <DropdownMenuItem
            className="cursor-pointer hover:bg-slate-700"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onViewDetails(instrumentName);
            }}
          >
            <Maximize2 className="mr-2 h-4 w-4" />
            View full details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={`cursor-pointer hover:bg-slate-700 ${isFavorite ? "text-amber-400" : "text-slate-200"}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(instrumentName);
            }}
          >
            <Star
              className={`mr-2 h-4 w-4 ${isFavorite ? "fill-amber-400" : ""}`}
            />
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SignalActionsMenu;
