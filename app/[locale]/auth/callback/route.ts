import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const locale = searchParams.get("locale") || "en";
  const next = searchParams.get("next") || "/signals";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect({ href: next, locale });
    }
  }

  redirect({ href: `/login?error=auth_error`, locale });
}
