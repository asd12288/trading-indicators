"use client";
import React, { use, useEffect, useState } from "react";
import supabase from "@/database/supabase/supabase";
import { useTranslations } from "next-intl";

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

    // Listen for real-time changes (optional)
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
    <div className="z-5000000 relative left-0 top-0 w-full bg-yellow-600 py-3 text-center text-sm font-medium text-black">
      {t("title")}
    </div>
  );
};

export default MaintenanceBanner;
