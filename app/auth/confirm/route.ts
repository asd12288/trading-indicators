import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";
  const params = { locale: searchParams.get("locale") ?? "en" };

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect({ href: next, locale: params.locale });
    }
  }

  // redirect the user to an error page with some instructions
  redirect({ href: "/error", locale: params.locale });
}
