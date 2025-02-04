import Link from "next/link";
import React from "react";
import UserAvatar from "./UserAvatar";

function Header() {
  return (
    <div className="w-full absolute z-50 hidden md:block">
      <ul className="flex justify-between p-8 text-lg font-medium items-center">
        <li>
          <Link href="/">
            <h2 className="font-medium text-3xl">Logo</h2>
          </Link>
        </li>

        <div className="flex gap-12 items-center">
          <li className=" hover:text-slate-300">
            <Link
              href="/indicators"
              className="hover:text-slate-300 flex items-center gap-2"
            >
              <p>Indicators</p>
            </Link>
          </li>

          <li>
            <Link href="/blog" className="hover:text-slate-300">
              Blog
            </Link>
          </li>
        </div>

        <div>
          <li>
            <UserAvatar />
          </li>
        </div>
      </ul>
    </div>
  );
}

export default Header;
