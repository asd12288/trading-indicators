"use server";

import { createClient } from "@/database/supabase/server";
import { z } from "zod";

// Our schema for sign-up (email confirmation required).
const signupSchema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function signup(formData: FormData) {
  const supabase = await createClient();

  try {
    // 1) Validate inputs
    const { email, password, confirmPassword } = signupSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    // 2) Attempt sign-up with Supabase
    // Pass `emailRedirectTo` so Supabase sends an email confirmation link.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        data: { role: "user" },
      },
    });

    if (error) {
      // Return the error to the client for display
      return { error: error.message };
    }

    // 3) If successful, do NOT redirect on the server.
    //    Instead, just return success so the client can do a dynamic redirect.
    return { success: true };
  } catch (err) {
    // 4) Handle Zod errors or any unknown issues
    if (err instanceof z.ZodError) {
      return {
        error: err.issues.map((issue) => issue.message).join(", "),
      };
    }
    return { error: "Unknown error occurred" };
  }
}