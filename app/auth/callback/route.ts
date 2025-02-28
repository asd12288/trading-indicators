import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing"; // or NextResponse if you want

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const locale = searchParams.get("locale") || "en";
  // If you stored “/signals” in the query param:
  const next = searchParams.get("next") || "/smart-alerts";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Could do redirect({ href: next, locale })
      // If next is /signals, that final route will be /{locale}/signals
      console.log(`Redirecting to ${next} with locale ${locale}`);

      return redirect({ href: next, locale });
    }
  }

  return redirect({ href: "/login?error=auth_error", locale });
}
