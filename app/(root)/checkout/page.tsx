import React from "react";
import { Metadata } from "next";
import { createClient } from "@/database/supabase/server";
import Checkout from "@/components/Checkout";
import { RequireAuth } from "@/components/RequireAuth";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Checkout",
};

const page = async () => {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  return <Checkout user={user} />;
};

export default page;
