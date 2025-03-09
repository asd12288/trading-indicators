"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export default function NewFeatureHighlight({
  title,
  description,
  featureId,
  children,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if this feature has been dismissed before
    const dismissed = localStorage.getItem(`feature_seen_${featureId}`);
    if (!dismissed) {
      setVisible(true);
    }
  }, [featureId]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(`feature_seen_${featureId}`, "true");
  };

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative mb-6"
    >
      <Card className="border border-yellow-500/30 bg-gradient-to-r from-slate-900 to-slate-800/90 shadow-lg">
        <button
          onClick={dismiss}
          className="absolute right-2 top-2 rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X size={16} />
        </button>
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <p className="mb-4 text-sm text-slate-300">{description}</p>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
