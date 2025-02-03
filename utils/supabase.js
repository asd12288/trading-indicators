// filepath: /path/to/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lcwpenbtlqwuxtlrdzbq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjd3BlbmJ0bHF3dXh0bHJkemJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzOTYzNjUsImV4cCI6MjA1Mzk3MjM2NX0.o5AUKOFLfTC4WxUpen3SGne6gi_1XX1XDEzs7na5pe8";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
