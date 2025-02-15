import { createClient } from "@/database/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import { LoginForm } from "@/components/LoginForm";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/signals");
  }

  return (
    <section>
      <div className="col-span-2 my-10 flex flex-col items-center justify-center p-2">
        <Link href="/">
          <div className="mb-4 flex items-center gap-2">
            <FaArrowLeft className="text-lg" />
            <p className="text-sm font-light hover:cursor-pointer hover:underline">
              Back Home
            </p>
          </div>
        </Link>
        <h1 className="mb-4 text-3xl font-bold">Login to your account</h1>

        <LoginForm />
      </div>
    </section>
  );
}
