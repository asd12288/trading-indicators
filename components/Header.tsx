import { createClient } from "@/database/supabase/server";
import Link from "next/link";
import LogoutBtn from "./LogoutBtn";
import UpgradeButton from "./UpgradeButton";
import Image from "next/image";

export default async function Header() {
  const supabase = await createClient();

  // Get the authenticated user
  const { data: authData, error: authError } = await supabase.auth.getUser();
  const user = authData?.user || null; // Ensure user is either an object or null

  let profile = null;

  // Only query profile if user exists
  if (user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      profile = data;
    }
  }

  return (
    <div className="relative top-0 z-50 hidden w-full md:block">
      <ul className="flex items-center justify-between p-8 text-lg font-medium">
        <li>
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={200} height={100} />
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

          {profile?.role === "admin" && (
            <li>
              <Link href="/admin" className="hover:text-slate-300">
                Admin
              </Link>
            </li>
          )}

          {user ? (
            <>
              <li>
                <Link href="/profile" className="hover:text-slate-300">
                  Profile
                </Link>
              </li>

              <UpgradeButton profile={profile} />

              <li>
                <LogoutBtn />
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" className="hover:text-slate-300">
                <button className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-900">
                  Login
                </button>
              </Link>
            </li>
          )}
        </div>
      </ul>
    </div>
  );
}
