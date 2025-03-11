"use client";

import AlertsTable from "@/components/AlertsTable";
import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";
import React from "react";

export const metadata = {
  title: "Instrument Alerts",
  description: "View and manage your instrument-specific alerts",
};

const InstrumentAlertsPage = async ({
  params,
}: {
  params: { locale: string; instrumentName: string };
}) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale: params.locale });
  }

  return (
    <div className="container mx-auto">
      <AlertsTable instrumentName={params.instrumentName} />
    </div>
  );
};

export default InstrumentAlertsPage;
