"use client";

import supabaseClient from "@/database/supabase/supabase";
import { useRouter } from "@/i18n/routing";
import React from "react";

export default function LogoutBtn({ locale, fullWidth = false }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push(`/${locale}`);
  };

  return (
    <button
      onClick={handleLogout}
      className={`${
        fullWidth ? "w-full rounded-md bg-slate-700 py-2.5" : ""
      } font-medium text-slate-300 hover:text-white`}
    >
      {fullWidth ? "Sign out" : "Sign out"}
    </button>
  );
}
