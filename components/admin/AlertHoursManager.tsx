'use client'

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Clock } from "lucide-react";
import { AlertHours } from "@/hooks/useAlertHours";
import supabaseClient from "@/database/supabase/supabase";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";
import { motion } from "framer-motion";

import AlertHoursList from "./alert-hours/AlertHoursList";
import AlertHourForm from "./alert-hours/AlertHourForm";

const AlertHoursManager = () => {
  const { theme } = useTheme();
  const [alertHours, setAlertHours] = useState<AlertHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState<Partial<AlertHours> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch alert hours from Supabase
  useEffect(() => {
    const fetchAlertHours = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabaseClient
          .from("alert_hours")
          .select("*")
          .order("instrument")
          .order("session_number");

        if (error) throw error;
        setAlertHours(data || []);
      } catch (err) {
        console.error("Error fetching alert hours:", err);
        toast({
          title: "Error",
          description: "Failed to load alert hours",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAlertHours();
  }, [toast]);

  const handleEdit = (item: AlertHours) => {
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setCurrentItem({
      instrument: "",
      instrument_group: "US Indices", // Default value
      session_number: 1,
      start_time_utc: "08:00:00",
      end_time_utc: "16:00:00",
      days_active: [1, 2, 3, 4, 5], // Monday-Friday
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabaseClient
        .from("alert_hours")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // Update local state
      setAlertHours(alertHours.filter(item => item.id !== id));
      
      toast({
        title: "Success",
        description: "Alert hours deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting alert hours:", err);
      toast({
        title: "Error",
        description: "Failed to delete alert hours",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (formData: Partial<AlertHours>) => {
    if (!formData || !formData.instrument || !formData.start_time_utc || !formData.end_time_utc) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (formData.id) {
        // Update existing item
        const { error } = await supabaseClient
          .from("alert_hours")
          .update({
            instrument: formData.instrument,
            instrument_group: formData.instrument_group,
            session_number: formData.session_number || 1,
            start_time_utc: formData.start_time_utc,
            end_time_utc: formData.end_time_utc,
            days_active: formData.days_active || [1, 2, 3, 4, 5],
            is_active: formData.is_active !== false,
          })
          .eq("id", formData.id);

        if (error) throw error;
        
        setAlertHours(prev => prev.map(item => 
          item.id === formData.id ? {...formData as AlertHours} : item
        ));
        
        toast({
          title: "Success",
          description: "Alert hours updated successfully",
        });
      } else {
        // Create new item
        const { data, error } = await supabaseClient.from("alert_hours").insert({
          instrument: formData.instrument,
          instrument_group: formData.instrument_group,
          session_number: formData.session_number || 1,
          start_time_utc: formData.start_time_utc,
          end_time_utc: formData.end_time_utc,
          days_active: formData.days_active || [1, 2, 3, 4, 5],
          is_active: formData.is_active !== false,
        }).select();

        if (error) throw error;
        
        if (data && data.length > 0) {
          setAlertHours(prev => [...prev, data[0] as AlertHours]);
        }
        
        toast({
          title: "Success",
          description: "Alert hours created successfully",
        });
      }

      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error saving alert hours:", err);
      toast({
        title: "Error",
        description: "Failed to save alert hours",
        variant: "destructive",
      });
    }
  };

  // Filter alert hours based on search term
  const filteredAlertHours = alertHours.filter(item => 
    item.instrument.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.instrument_group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-900/30 p-3">
            <Clock className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Alert Hours Management</h1>
            <p className="text-slate-400">Configure when alerts are active for each instrument</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <Card className={theme === "dark" ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white"}>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <AlertHoursList 
              alertHours={filteredAlertHours} 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onEdit={handleEdit} 
              onDelete={handleDelete}
            />
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className={cn(
              "sm:max-w-[500px]",
              theme === "dark" ? "bg-slate-900 text-slate-100 border-slate-700" : "bg-white"
            )}>
              <AlertHourForm 
                currentItem={currentItem}
                onSubmit={handleSubmit}
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AlertHoursManager;