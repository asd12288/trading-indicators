import { createClient } from "@supabase/supabase-js";

const supabasePaddleClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    db: { schema: "paddle" }, // Default schema to "paddle"
  },
);

export default supabasePaddleClient;
