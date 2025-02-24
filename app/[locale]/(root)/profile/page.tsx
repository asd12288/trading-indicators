import UserDashboard from "@/components/UserDashboard";
import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";

export default async function Page({ params }: { params: { locale: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.id) {
    return redirect({ href: "/login", locale: params.locale });
  }

  return (
    <div className="flex flex-col items-center justify-center p-2 md:p-12">
      <UserDashboard user={user} />
    </div>
  );
}
