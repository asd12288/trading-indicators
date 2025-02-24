import { createClient } from "@/database/supabase/server";

import React from "react";
import { LoginForm } from "@/components/LoginForm";
import { Link, redirect } from "@/i18n/routing";
import { FaArrowLeft } from "react-icons/fa";

export default async function LoginPage({ params }: { params: { locale: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect({ href: "/signals", locale: params.locale });
  }
  

  return (
    <section className="flex flex-col items-center justify-center max-h-screen">
      <div className="col-span-2 md:my-10 flex flex-col items-center justify-center p-2">
       

        <LoginForm />
      </div>
    </section>
  );
}
