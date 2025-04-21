import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if path requires authentication
  const authRequiredPaths = [
    "/admin",
    "/settings",
    "/profile",
    "/smart-alerts",
    '/alerts',
    "/notifications",
    "/success"
    // Add other protected paths here
  ];

  const pathWithoutLocale = request.nextUrl.pathname.replace(
    /^\/(sp|en|fr|ru)/,
    "",
  );
  const requiresAuth = authRequiredPaths.some((path) =>
    pathWithoutLocale.startsWith(path),
  );

  if (
    !user &&
    requiresAuth &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // Extract locale from URL or default to "en"
    const urlPathParts = request.nextUrl.pathname.split("/");
    const locale = ["en", "sp", "fr", "ru"].includes(urlPathParts[1])
      ? urlPathParts[1]
      : "en";

    // Clone the URL and modify it to include locale
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;

    // Add returnUrl as a query parameter
    url.searchParams.set("returnUrl", request.nextUrl.pathname);

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
