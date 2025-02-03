import LoginForm from "@/components/LoginForm";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import login from "@/public/login.png";

function page() {
  return (
    <section>
      <div className="h-screen w-full gap-4 md:grid md:grid-cols-2">
        <Link
          href="/"
          className="absolute right-6 top-4 text-xs font-thin text-slate-100 hover:underline"
        >
          Back to the main page
        </Link>

        <div className="hidden justify-center rounded-sm p-8 md:flex">
          <Image
            src={login}
            alt="logo"
            width={500}
            height={500}
            className="h-auto max-w-full rounded-xl"
          />
        </div>
        <div className="mt:m-0 mt-20 flex w-full flex-col items-center justify-center p-8">
          <h2 className="mb-5 text-left text-5xl font-medium">Sign in</h2>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}

export default page;
