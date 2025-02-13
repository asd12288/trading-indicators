"use server";

import { createClient } from "@/database/supabase/server";

export async function sendResetPasswordEmail(prev, formData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email"),
  );

  if (error) {
    console.log(error.message);

    return {
      error: error.message,
      success: false,
    };
  }

  return {
    success: "Email sent please check your inbox",
  };
}
