import { createClient } from "@/database/supabase/server";

import { LoginForm } from "@/components/LoginForm";
import { redirect } from "@/i18n/routing";

export default async function LoginPage({
  params,
}: {
  params: { locale: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect({ href: "/smart-alerts", locale: params.locale });
  }

  return (
    <section className="flex max-h-screen flex-col items-center justify-center">
      <div className="col-span-2 flex flex-col items-center justify-center p-2 md:my-10">
        <LoginForm />
      </div>
    </section>
  );
}
