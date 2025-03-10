import BlogTable from "@/components/admin/BlogTable";
import SendNotificationForm from "@/components/admin/SendNotificationForm";
import SignalDebugTab from "@/components/admin/SignalDebugTab";
import SignalsMonitoring from "@/components/admin/SignalsMonitoring";
import SignalsTable from "@/components/admin/SignalsTable";
import UsersTable from "@/components/admin/UsersTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};

const page = async ({ params }: { params: { locale: string } }) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.id) {
    return redirect({ href: "/login", locale: params.locale });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin" ? true : false;

  if (!isAdmin) {
    return redirect("/");
  }

  const { data: users } = await supabase.from("profiles").select("*");
  const { data: signals } = await supabase
    .from("all_signals")
    .select("*")
    .order("entry_time", { ascending: false });
  const { data: posts } = await supabase.from("blogs").select("*");

  return (
    <div className="min-h-min">
      <h1 className="my-4 text-center text-3xl font-medium">Admin Page</h1>
      <div className="flex justify-center p-4">
        <div className="w-full rounded-md bg-slate-800 p-12">
          <Tabs defaultValue="debug">
            <TabsList className="flex justify-center bg-inherit">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="signals">Signals</TabsTrigger>
              <TabsTrigger value="blogs">Blogs</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="monitoring">Debugging</TabsTrigger>
              <TabsTrigger value="debug">Signal Debug</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <UsersTable users={users} />
            </TabsContent>

            <TabsContent value="signals">
              <SignalsTable signals={signals} />
            </TabsContent>

            <TabsContent value="blogs">
              <BlogTable posts={posts} />
            </TabsContent>

            <TabsContent value="notifications">
              <div className="space-y-6">
                <SendNotificationForm />
              </div>
            </TabsContent>

            <TabsContent value="debug">
              <SignalDebugTab />
            </TabsContent>

            <TabsContent value="monitoring">
              <SignalsMonitoring />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default page;
