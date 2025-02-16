import SignalsTable from "@/components/admin/SignalsTable";
import UsersTable from "@/components/admin/UsersTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/database/supabase/server";
import { TabsContent } from "@radix-ui/react-tabs";
import { Sign } from "crypto";

const page = async () => {
  const supabase = await createClient();

  const { data: users } = await supabase.from("profiles").select("*");
  const { data: signals } = await supabase.from("all_signals").select("*");

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
            </TabsList>

            <TabsContent value="users">
              <UsersTable users={users} />
            </TabsContent>

            <TabsContent value="signals">
              <SignalsTable signals={signals} />
            </TabsContent>

            <TabsContent value="signals">Signals</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default page;
