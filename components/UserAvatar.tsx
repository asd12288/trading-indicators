import { auth } from "@/auth";
import React from "react";
import SignOut from "./Signout";
import Link from "next/link";


async function UserAvatar() {
  const session = await auth();

  return (
    <div className="flex flex-row items-center gap-5 font-light">
      {!session?.user && (
        <>
          <Link
            href="/login"
            className="rounded-full bg-green-600 px-6 py-2 font-medium hover:bg-green-700"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-green-700 px-6 py-2 font-medium hover:bg-green-800"
          >
            Create An Account
          </Link>
        </>
      )}
      {session?.user && (
        <div className="flex items-center gap-5">
          <Link
            href="/profile"
            className="flex items-center gap-2 font-medium hover:text-slate-300"
          >
            <h2>My Account</h2>
          </Link>
          <SignOut />
        </div>
      )}
    </div>
  );
}

export default UserAvatar;
