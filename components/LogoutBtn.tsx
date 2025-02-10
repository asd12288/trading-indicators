import { logout } from "@/app/(auth)/login/actions";
import React from "react";
import { IoMdExit } from "react-icons/io";

const LogoutBtn = () => {
  return (
    <form action={logout}>
      <button className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-900">
        Logout
        <IoMdExit />{" "}
      </button>
    </form>
  );
};

export default LogoutBtn;
