import BelowTheFold from "@/components/homePage/BelowTheFold";
import Hero from "@/components/homePage/Hero";
import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";

// The main page component
export default async function Page({ params }: { params: { locale: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect({ href: "/smart-alerts", locale: params.locale });
  }

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
