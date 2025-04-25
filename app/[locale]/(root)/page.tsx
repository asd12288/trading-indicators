import Hero from "@/components/homePage/Hero";
import BelowTheFold from "@/components/homePage/BelowTheFold";
import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";

export const dynamic = "force-static";
export const revalidate = 3600; // revalidate static page every hour

// This function handles user authentication on the server
async function getAuthStatus(locale: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect({ href: "/smart-alerts", locale });
    return true; // Won't be used due to redirect, but needed for typing
  }
  return false;
}

// The main page component
export default async function Page({ params }: { params: { locale: string } }) {
  // This runs server-side before rendering client components
  await getAuthStatus(params.locale);

  // Render page content once we know user isn't authenticated
  return (
    <>
      <div className="relative">
        <section>
          <Hero />
        </section>
        {/* render all client-side sections inside this client component */}
        <BelowTheFold />
      </div>
    </>
  );
}
