"use client";
import React, { useEffect, useState } from "react";
import supabase from "@/database/supabase/client";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const MaintenanceBanner = () => {
  const [isActive, setIsActive] = useState(false);
  const t = useTranslations("MaintenanceBanner");

  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "maintenance_mode")
        .single();

      if (data) {
        setIsActive(data.value);
      }
    };

    fetchMaintenanceStatus();

    // Listen for real-time changes
    const subscription = supabase
      .channel("maintenance")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "settings" },
        fetchMaintenanceStatus,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="sticky left-0 top-0 z-50 w-full shadow-md"
        >
          <div className="bg-gradient-to-r from-amber-600 to-yellow-600 py-3">
            <div className="container mx-auto flex items-center justify-center gap-2 px-4">
              <AlertTriangle className="h-5 w-5 text-white" />
              <p className="text-center text-sm font-medium text-white">
                {t("title")}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MaintenanceBanner;
