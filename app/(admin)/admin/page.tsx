import BlogTable from "@/components/admin/BlogTable";
import SignalsMonitoring from "@/components/admin/SignalsMonitoring";
import SignalsTable from "@/components/admin/SignalsTable";
import UsersTable from "@/components/admin/UsersTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/database/supabase/server";
import { TabsContent } from "@radix-ui/react-tabs";

const page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!user || profile.role !== "admin") {
    return <h1 className="text-center text-2xl font-semibold">Unauthorized</h1>;
  }

  const { data: users } = await supabase.from("profiles").select("*");
  const { data: signals } = await supabase.from("all_signals").select("*");
  const { data: posts } = await supabase.from("blogs").select("*");
  const { data: signalsStatus } = await supabase
    .from("status_alert")
    .select("*")
    .limit(1000);

  return (
    <div className="min-h-min">
      <h1 className="my-4 text-center text-3xl font-medium">Admin Page</h1>
      <div className="flex justify-center p-4">
        <div className="w-full rounded-md bg-slate-800 p-12">
          <Tabs defaultValue="signals">
            <TabsList className="flex justify-center bg-inherit">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="signals">Signals</TabsTrigger>
              <TabsTrigger value="blogs">Blogs</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
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

            <TabsContent value="monitoring">
              <SignalsMonitoring signalsStatus={signalsStatus} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default page;
