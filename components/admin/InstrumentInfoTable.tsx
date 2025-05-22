"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Search, X, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";
import supabaseClient from "@/database/supabase/supabase";
import { useToast } from "@/hooks/use-toast";
import InstrumentTable from "./instruments/InstrumentTable";
import InstrumentForm from "./instruments/InstrumentForm";
import DeleteInstrumentDialog from "./instruments/DeleteInstrumentDialog";
import { InstrumentInfo } from "@/types";
import Pagination from "./instruments/Pagination";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const PAGE_SIZE = 10;

const defaultInstrument: InstrumentInfo = {
  instrument_name: "",
  full_name: "",
  contract_size: "",
  tick_size: "",
  tick_value: "",
  exchange: "",
  basic_info: "",
  external_link: "",
  margin_requirement: "",
  trading_hours: "",
  volatility_level: "",
};

export default function InstrumentInfoTable() {
  const { theme } = useTheme();
  const [instruments, setInstruments] = useState<InstrumentInfo[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentInstrument, setCurrentInstrument] =
    useState<InstrumentInfo | null>(null);
  const [formData, setFormData] = useState<InstrumentInfo>(defaultInstrument);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Fetch instruments data with pagination and search
  const fetchInstruments = async (
    page: number = 1,
    search: string = searchQuery,
  ) => {
    setLoading(true);
    setIsSearching(!!search);

    try {
      let query = supabaseClient
        .from("instruments_info")
        .select("*", { count: "exact" });

      // Apply search filter if search query exists
      if (search) {
        query = query.ilike("instrument_name", `%${search}%`);
      }

      // Get total count for pagination
      const countResult = await query;
      setTotalCount(countResult.count || 0);

      // Get paginated data
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const dataQuery = query.range(from, to).order("instrument_name");
      const { data, error } = await dataQuery;

      if (error) {
        throw error;
      }

      setInstruments(data || []);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching instrument info:", error);
      toast({
        title: "Error",
        description: "Failed to load instrument information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInstruments(1, searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Initial fetch
  useEffect(() => {
    fetchInstruments();
  }, []);

  const handleSearchClear = () => {
    setSearchQuery("");
    fetchInstruments(1, "");
  };

  // Handle add instrument
  const handleAddInstrument = async (formData: InstrumentInfo) => {
    setSaving(true);
    try {
      // Create payload with empty strings instead of nulls for missing fields
      const payload = {
        instrument_name: formData.instrument_name || "",
        full_name: formData.full_name || "",
        contract_size: formData.contract_size || "",
        tick_size: formData.tick_size || "",
        tick_value: formData.tick_value || "",
        exchange: formData.exchange || "",
        basic_info: formData.basic_info || "",
        external_link: formData.external_link || "",
        margin_requirement: formData.margin_requirement || "",
        trading_hours: formData.trading_hours || "",
        volatility_level: formData.volatility_level || "",
      };

      const { data, error } = await supabaseClient
        .from("instruments_info")
        .insert([payload])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Added instrument ${formData.instrument_name}`,
      });

      setIsAddDialogOpen(false);
      fetchInstruments(currentPage);
    } catch (error) {
      console.error("Error adding instrument:", error);
      toast({
        title: "Error",
        description:
          "Failed to add instrument: " + (error.message || "Unknown error"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle edit instrument
  const handleEditInstrument = async (formData: InstrumentInfo) => {
    if (!formData.id) {
      toast({
        title: "Error",
        description: "Cannot update instrument: missing ID",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      // Create payload with empty strings instead of nulls for missing fields
      const payload = {
        instrument_name: formData.instrument_name || "",
        full_name: formData.full_name || "",
        contract_size: formData.contract_size || "",
        tick_size: formData.tick_size || "",
        tick_value: formData.tick_value || "",
        exchange: formData.exchange || "",
        basic_info: formData.basic_info || "",
        external_link: formData.external_link || "",
        margin_requirement: formData.margin_requirement || "",
        trading_hours: formData.trading_hours || "",
        volatility_level: formData.volatility_level || "",
      };

      // First verify if the record exists
      const { data: existingData, error: checkError } = await supabaseClient
        .from("instruments_info")
        .select("id")
        .eq("id", formData.id)
        .single();

      if (checkError) {
        throw new Error(`Record not found: ${checkError.message}`);
      }

      if (!existingData) {
        throw new Error(`No instrument found with ID: ${formData.id}`);
      }

      const { data, error } = await supabaseClient
        .from("instruments_info")
        .update(payload)
        .eq("id", formData.id)
        .select();

      if (error) {
        throw new Error(error.message || "Update failed");
      }

      toast({
        title: "Success",
        description: `Updated instrument ${formData.instrument_name}`,
      });

      setIsEditDialogOpen(false);
      fetchInstruments(currentPage);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message || "Check console for details",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete instrument
  const handleDeleteInstrument = async () => {
    if (!currentInstrument?.id) {
      toast({
        title: "Error",
        description: "Cannot delete: Missing instrument ID",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      // First verify the record exists
      const { data: existingData, error: checkError } = await supabaseClient
        .from("instruments_info")
        .select("id, instrument_name")
        .eq("id", currentInstrument.id)
        .single();

      if (checkError) {
        throw new Error(`Record not found: ${checkError.message}`);
      }

      if (!existingData) {
        throw new Error(`No instrument found with ID: ${currentInstrument.id}`);
      }

      const { error } = await supabaseClient
        .from("instruments_info")
        .delete()
        .eq("id", currentInstrument.id);

      if (error) {
        throw new Error(error.message || "Deletion failed");
      }

      toast({
        title: "Success",
        description: `Deleted instrument ${currentInstrument.instrument_name}`,
      });

      setIsDeleteDialogOpen(false);
      setCurrentInstrument(null);

      // If we're on the last page and deleted the last item, go to previous page
      const isLastPageAndEmpty =
        currentPage > 1 &&
        instruments.length === 1 &&
        currentPage === Math.ceil(totalCount / PAGE_SIZE);

      fetchInstruments(isLastPageAndEmpty ? currentPage - 1 : currentPage);
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete instrument",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const openEditDialog = (instrument: InstrumentInfo) => {
    setFormData({ ...instrument });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (instrument: InstrumentInfo) => {
    setCurrentInstrument(instrument);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateNew = () => {
    setFormData(defaultInstrument);
    setIsAddDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-cyan-900/30 p-3">
            <BarChart3 className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Instrument Information</h1>
            <p className="text-slate-400">Manage instrument specifications and contract details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <Card className={theme === "dark" ? "bg-slate-800/80 border-slate-700/50" : "bg-white"}>
        <CardContent className="space-y-4 pt-6">
          {/* Search Bar */}
          <div className="flex items-center">
            <div className="relative flex w-full max-w-sm items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search instruments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-slate-700 bg-slate-800 pl-9 text-slate-200"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 h-7 w-7 p-0 text-slate-400"
                  onClick={handleSearchClear}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {loading && instruments.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <>
              {isSearching && (
                <div className="text-sm text-slate-400">
                  {totalCount === 0 ? (
                    <span>No instruments found matching "{searchQuery}"</span>
                  ) : (
                    <span>
                      Found {totalCount} instrument{totalCount !== 1 ? "s" : ""}{" "}
                      matching "{searchQuery}"
                    </span>
                  )}
                </div>
              )}

              <InstrumentTable
                instruments={instruments}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                loading={loading}
              />

              <Pagination
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={PAGE_SIZE}
                onPageChange={(page) => fetchInstruments(page, searchQuery)}
              />
            </>
          )}

          {/* Add Instrument Dialog */}
          <InstrumentForm
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            title="Add New Instrument"
            description="Enter the details for the new instrument"
            initialData={defaultInstrument}
            onSubmit={handleAddInstrument}
            isSubmitting={saving}
            submitLabel="Save Instrument"
          />

          {/* Edit Instrument Dialog */}
          <InstrumentForm
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            title={`Edit Instrument: ${formData.instrument_name}`}
            description="Update the instrument details"
            initialData={formData}
            onSubmit={handleEditInstrument}
            isSubmitting={saving}
            submitLabel="Update Instrument"
          />

          {/* Delete Confirmation Dialog */}
          <DeleteInstrumentDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            instrumentName={currentInstrument?.instrument_name || ""}
            onDelete={handleDeleteInstrument}
            isDeleting={saving}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
