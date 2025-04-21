import { createClient } from "@/database/supabase/server";
import { getTranslations } from "next-intl/server";
import NotificationsClient from "@/components/notifications/NotificationsClient";
import PageTitle from "@/components/PageTitle";
import PageContainer from "@/components/PageContainer";
import { redirect } from "@/i18n/routing";

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: "Notifications" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function NotificationsPage({ params, searchParams }) {
  const supabase = await createClient();

  // Check if the user is authenticated
  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      {
        href: "/login",
        locale: params.locale,
      }, // Redirect to login with return URL
    );
    // Redirect to login if not authenticated
  }

  // Get user profile for personalization
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Parse pagination and filter params
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const filter = searchParams.type || "all";
  const readStatus = searchParams.read || "all";

  // Build query conditionally instead of using maybeEq
  let query = supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Add type filter if needed
  if (filter !== "all") {
    query = query.eq("type", filter);
  }

  // Add read status filter if needed
  if (readStatus === "read") {
    query = query.eq("read", true);
  } else if (readStatus === "unread") {
    query = query.eq("read", false);
  }

  // Execute the query
  const { count } = await query;

  return (
    <PageContainer maxWidth="2xl" className="py-8">
      <div className="space-y-6">
        <PageTitle
          title={
            profile?.username
              ? `${profile.username}'s Notifications`
              : "Your Notifications"
          }
          description="Manage all your notifications and alerts in one place"
        />

        <NotificationsClient
          userId={user.id}
          initialPage={page}
          initialPageSize={pageSize}
          initialFilter={filter}
          initialReadStatus={readStatus}
          totalCount={count || 0}
        />
      </div>
    </PageContainer>
  );
}
