"use client";
import React, { useEffect, useState } from "react";
import supabase from "@/database/supabase/supabase";

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
    <div className="p-6 flex justify-center flex-col items-center">
      <h1 className="text-xl font-bold text-white">Admin - Maintenance Mode</h1>
      <p className="mt-2 text-gray-400">
        {isActive ? "Maintenance mode is active." : "Maintenance mode is off."}
      </p>
      <button
        onClick={toggleMaintenance}
        disabled={loading}
        className={`mt-4 px-6 py-3 rounded-lg ${
          isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        } text-white transition`}
      >
        {loading ? "Updating..." : isActive ? "Disable Maintenance" : "Enable Maintenance"}
      </button>
    </div>
  );
};

export default AdminMaintenance;
