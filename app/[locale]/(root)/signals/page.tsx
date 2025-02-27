import SignalsLayout from "@/components/SignalsLayout";
import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signals",
};

async function page({ params }: { params: { locale: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale: params.locale });
  }

  return (
    <div>
      <SignalsLayout userId={user?.id} key={params.locale} />
    </div>
  );
}

export default page;
