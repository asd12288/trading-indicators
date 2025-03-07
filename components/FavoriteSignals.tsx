import React from "react";
import { Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Signal {
  instrument_name: string;
  price?: number;
  change_24h?: number;
  // Add other signal properties as needed
}

interface FavoriteSignalsProps {
  favouriteSignals: Signal[];
}

const FavoriteSignals: React.FC<FavoriteSignalsProps> = ({
  favouriteSignals,
}) => {
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        <Star className="h-4 w-4 text-yellow-400" />
        <h3 className="text-sm font-medium text-slate-300">Favorite Signals</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {favouriteSignals.map((signal, index) => (
          <motion.div
            key={signal.instrument_name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between rounded-lg border border-yellow-500/20 bg-slate-800/60 p-3 shadow-sm hover:bg-slate-800/80"
          >
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="font-medium text-slate-200">
                {signal.instrument_name}
              </span>
            </div>

            {signal.price && (
              <div className="text-sm font-medium">
                <span className="text-slate-300">{signal.price}</span>
                {signal.change_24h && (
                  <span
                    className={`ml-2 ${signal.change_24h > 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {signal.change_24h > 0 ? "+" : ""}
                    {signal.change_24h.toFixed(2)}%
                  </span>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteSignals;
