import Checkout from "@/components/Checkout";
import { createClient } from "@/database/supabase/server";
import React from "react";

const page = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="flex h-screen flex-col items-center justify-center p-12">
      <Checkout userEmail={data.user?.email} userId={data.user?.id} />
    </div>
  );
};

export default page;
