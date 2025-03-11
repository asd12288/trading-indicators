import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RunningSignalBadgeProps {
  instrumentName: string;
  isLong: boolean;
  price?: number | string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const RunningSignalBadge: React.FC<RunningSignalBadgeProps> = ({
  instrumentName,
  isLong,
  price,
  size = "md",
  onClick,
}) => {
  // Determine sizing classes based on size prop
  const sizeClasses = {
    sm: "py-0.5 px-2 text-xs gap-1",
    md: "py-1 px-2.5 text-sm gap-1.5",
    lg: "py-1.5 px-3 text-base gap-2",
  };

  // Determine icon size based on badge size
  const iconSize = size === "sm" ? 12 : size === "md" ? 16 : 20;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        "inline-flex cursor-pointer items-center rounded-full font-medium shadow-sm",
        sizeClasses[size],
        isLong
          ? "bg-gradient-to-r from-emerald-700/80 to-emerald-600/80 text-emerald-100"
          : "bg-gradient-to-r from-rose-700/80 to-rose-600/80 text-rose-100",
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full",
          isLong ? "bg-emerald-500/30" : "bg-rose-500/30",
        )}
        style={{ width: iconSize, height: iconSize }}
      >
        {isLong ? (
          <ArrowUpRight size={iconSize * 0.7} strokeWidth={3} />
        ) : (
          <ArrowDownRight size={iconSize * 0.7} strokeWidth={3} />
        )}
      </div>

      <span className="max-w-[80px] truncate">{instrumentName}</span>

      {price && (
        <span className="font-bold tabular-nums">
          {typeof price === "number" ? price.toFixed(2) : price}
        </span>
      )}

      {/* Pulsing dot indicator for active signal */}
      <motion.div
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={cn(
          "rounded-full",
          size === "sm"
            ? "h-1.5 w-1.5"
            : size === "md"
              ? "h-2 w-2"
              : "h-2.5 w-2.5",
          isLong ? "bg-emerald-300" : "bg-rose-300",
        )}
      />
    </motion.div>
  );
};

export default RunningSignalBadge;
