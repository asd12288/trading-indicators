import Checkout from "@/components/Checkout";
import { createClient } from "@/database/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center p-12">
      <Checkout userEmail={user?.email} userId={user?.id} />
    </div>
  );
};

export default page;
