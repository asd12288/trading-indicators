import SignalsLayout from "@/components/SignalsLayout";
import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";
import { Metadata } from "next";

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

  return (
    <div>
      <SignalsLayout userId={user?.id} key={locale} />
    </div>
  );
}

export default page;
