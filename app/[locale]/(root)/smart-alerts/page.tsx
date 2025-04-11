
import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";
import { Metadata } from "next";
import SignalsLayout from "@/components/SignalsLayout";

export const metadata: Metadata = {
  title: "Smart Alerts",
};

async function page({ params }: { params: { locale: string } }) {
  const supabase = await createClient();
  const { locale } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale: locale });
  }

  return <SignalsLayout userId={user?.id} />;
}

export default page;
