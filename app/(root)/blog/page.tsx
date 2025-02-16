import BlogList from "@/components/BlogList";
import { createClient } from "@/database/supabase/server";

async function page() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("blogs").select("*");

  if (error) {
    return <h1>Error loading blogs</h1>;
  }

  return (
    <div className="">
      <h1 className="my-5 text-center text-5xl font-semibold">Blogs</h1>
      <div className="my-4 w-full border-t"></div>
      <div className="px-32">
        <BlogList blogs={data} />
      </div>
    </div>
  );
}

export default page;
