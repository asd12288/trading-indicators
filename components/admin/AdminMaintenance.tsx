"use client";
import React, { useEffect, useState } from "react";
import supabase from "@/database/supabase/client";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

const AdminMaintenance = () => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

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
  }, []);

  const toggleMaintenance = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("settings")
      .update({ value: !isActive })
      .eq("key", "maintenance_mode");

    if (!error) {
      setIsActive((prev) => !prev);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800 shadow-lg"
    >
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
        <div className="flex items-center gap-3">
          <div className={`rounded-full ${isActive ? 'bg-amber-900/30' : 'bg-emerald-900/30'} p-3`}>
            {isActive ? 
              <AlertTriangle className="h-6 w-6 text-amber-400" /> : 
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            }
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Maintenance Mode</h1>
            <p className="text-slate-400">Control the site maintenance status</p>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between rounded-lg bg-slate-700/30 p-4">
          <div>
            <h3 className="text-lg font-medium text-white">Current Status</h3>
            <p className="text-slate-400">
              {isActive 
                ? "Maintenance mode is active. The site is displaying a warning banner to all users." 
                : "Maintenance mode is inactive. The site is operating normally."}
            </p>
          </div>
          <div className={`rounded-full ${isActive ? 'bg-amber-500/20' : 'bg-emerald-500/20'} px-4 py-2`}>
            <span className={`text-sm font-medium ${isActive ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center gap-4">
          <Button
            onClick={toggleMaintenance}
            disabled={loading}
            size="lg"
            className={`min-w-[200px] ${
              isActive 
                ? "bg-emerald-600 hover:bg-emerald-700" 
                : "bg-amber-600 hover:bg-amber-700"
            } transition-all duration-200`}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isActive ? (
              <CheckCircle className="mr-2 h-4 w-4" />
            ) : (
              <AlertTriangle className="mr-2 h-4 w-4" />
            )}
            {loading
              ? "Processing..."
              : isActive
              ? "Disable Maintenance Mode"
              : "Enable Maintenance Mode"}
          </Button>
          <p className="text-center text-sm text-slate-400">
            {isActive
              ? "Disabling maintenance mode will remove the warning banner."
              : "Enabling maintenance mode will display a warning banner to all users."}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminMaintenance;
