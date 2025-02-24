"use server";

import { createClient } from "@/database/supabase/server";
import { redirect } from "@/i18n/routing";

export async function updatePassword(prev, formData) {
  const supabase = await createClient();

  const data = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const { error } = await supabase.auth.updateUser({
    password: data.password,
  });

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  if (!error) {
    redirect({ href: "/profile", locale: params.locale || 'en'});
  }
}
