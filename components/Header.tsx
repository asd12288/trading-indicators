import { logout } from "@/app/login/actions";
import { createClient } from "@/database/supabase/server";
import Link from "next/link";
import React from "react";

async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="z-50 hidden w-full md:block">
      <ul className="flex items-center justify-between p-8 text-lg font-medium">
        <li>
          <Link href="/">
            <h2 className="text-3xl font-medium">Logo</h2>
          </Link>
        </li>

        <div className="flex items-center gap-12">
          <li className="hover:text-slate-300">
            <Link
              href="/signals"
              className="flex items-center gap-2 hover:text-slate-300"
            >
              <p>Signals</p>
            </Link>
          </li>

          <li>
            <Link href="/blog" className="hover:text-slate-300">
              Blog
            </Link>
          </li>
          {user === null ? (
            <li>
              <Link href="/login" className="hover:text-slate-300">
                <button>Login</button>
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link href="/profile" className="hover:text-slate-300">
                  Profile
                </Link>
              </li>

              <li>
                <form action={logout}>
                  <button>Logout</button>
                </form>
              </li>
            </>
          )}
        </div>
      </ul>
    </div>
  );
}

export default Header;
