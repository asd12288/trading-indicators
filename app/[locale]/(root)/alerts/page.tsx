import AlertsTable from "@/components/AlertsTable";
import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";
import React from "react";


export 



const page = async ({ params }: { params: { locale: string } }) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale: params.locale });
  }
  return (
    <div>
      <AlertsTable />
    </div>
  );
};

export default page;
