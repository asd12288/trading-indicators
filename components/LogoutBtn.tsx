"use client";

import { logout } from "@/app/[locale]/(auth)/login/actions";
import React from "react";
import { IoMdExit } from "react-icons/io";

export default function LogoutBtn({ locale }: { locale: string }) {
  return (
    <form action={logout}>
      {/* This hidden field is how we pass the locale to the server action */}
      <input type="hidden" name="locale" value={locale} />

      <button className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-900">
        Logout
        <IoMdExit />
      </button>
    </form>
  );
}
