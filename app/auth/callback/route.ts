import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing"; // or NextResponse if you want

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const locale = searchParams.get("locale") || "en";
  const next = searchParams.get("next") || "/smart-alerts";

  // If next is an invalid route (like /signals), redirect to /login
  const invalidNextRoutes = ["/signals"]; // Add more invalid routes if needed
  const isInvalidNext = invalidNextRoutes.includes(next);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (isInvalidNext) {
        return redirect({ href: "/login", locale });
      }
      console.log(`Redirecting to ${next} with locale ${locale}`);

      return redirect({ href: next, locale });
    }
  }

  return redirect({ href: "/login?error=auth_error", locale });
}
