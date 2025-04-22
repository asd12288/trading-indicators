import React, { memo } from "react";
import { Signal } from "@/lib/types";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import SignalCard from "../SignalCard/SignalCard";
import { Star } from "lucide-react";
import QuickActionsMenu from "./QuickActionsMenu";

interface DashboardSignalCardProps {
  signal: Signal;
  layout: "grid" | "list";
  onRemoveFavorite: (instrumentName: string) => void;
  onViewDetails: (instrumentName: string) => void;
}

const DashboardSignalCard = memo(
  ({
    signal,
    layout,
    onRemoveFavorite,
    onViewDetails,
  }: DashboardSignalCardProps) => {
    return (
      <motion.div
        className={cn(
          "group relative rounded-xl border-2 shadow-md transition-all",
          layout === "grid" ? "h-full" : "min-w-[350px] max-w-[350px]",
          "border-yellow-500/20 hover:border-yellow-500/40 hover:shadow-yellow-400/10",
          "bg-slate-900",
        )}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Star icon to indicate favorite */}
        <div className="absolute -right-2 -top-2 z-10">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        </div>

        {/* Quick actions menu in top-right corner */}
        <div className="absolute right-2 top-2 z-20">
          <QuickActionsMenu
            instrumentName={signal.instrument_name}
            isFavorite={true} // Always true for dashboard cards
            onToggleFavorite={onRemoveFavorite}
            onViewDetails={onViewDetails}
          />
        </div>

        <Link
          href={`/smart-alerts/${signal.instrument_name}`}
          className="block h-full w-full"
        >
          <div className="p-2">
            <SignalCard
              signalPassed={signal}
              showFavoriteControls={false}
              className="pointer-events-none"
              userId={signal.userId}
            />
          </div>
        </Link>
      </motion.div>
    );
  },
);

DashboardSignalCard.displayName = "DashboardSignalCard";

export default DashboardSignalCard;
