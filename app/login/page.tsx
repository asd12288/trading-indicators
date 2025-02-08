import { createClient } from "@/database/supabase/server";
import { emailLogin, signup } from "./actions";
import { redirect } from "next/navigation";
import React from "react";
import { LoginForm } from "@/components/LoginForm";
import Image from "next/image";

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/signals");
  }

  return (
    <section className="grid grid-cols-2 items-center gap-8 p-8">
      <Image src="/login.png" alt="Login" width={500} height={500} />
      <div className="flex flex-col items-center justify-center">
        <LoginForm />
      </div>
    </section>
  );
}
