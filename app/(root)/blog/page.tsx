import BlogList from "@/components/BlogList";
import supabase from "@/database/supabase/supabase";

async function page() {
  const { data, error } = await supabase.from("blogs").select("*");

  if (error) {
    return <h1>Error loading blogs</h1>;
  }

  return (
    <>
      <h1 className="text-5xl text-center my-5 font-semibold">Blogs</h1>
      <div className="border-t w-full my-4"></div>
      <div className="px-32">
        <BlogList blogs={data} />
      </div>
    </>
  );
}

export default page;
