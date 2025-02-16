import SignalLayout from "@/components/SignalLayout";
import { createClient } from "@/database/supabase/server";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  if (!params?.id) {
    console.error("No ID provided in URL params");
    redirect("/signals");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    console.error("Auth error or missing user ID:", userError);
    redirect("/login");
  }

  // Validate that we have both required parameters before rendering
  if (!params.id || !user.id) {
    console.error("Missing required parameters:", {
      signalId: params.id,
      userId: user.id,
    });
    redirect("/signals");
  }

  return (
    <div className="mt-32">
      <SignalLayout
        id={params.id}
        userId={user.id} // Remove optional chaining here
      />
    </div>
  );
}
