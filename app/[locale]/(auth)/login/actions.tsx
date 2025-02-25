"use server";

import { createClient } from "@/database/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect as redirectNext } from "next/navigation";
import { redirect } from "@/i18n/routing";

import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function emailLogin(formData: FormData) {
  const supabase = await createClient();

  try {
    // If you want to handle locale, pass it in FormData:
    //   const locale = (formData.get("locale") as string) ?? "en";

    const { email, password } = loginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Check if account exists
    const { data: userExists, error: userCheckError } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .single();

    if (userCheckError || !userExists) {
      return { error: "Account does not exist. Please sign up first." };
    }

    // Attempt login
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.message.toLowerCase().includes("confirm")) {
        // ... resend confirmation link code ...
        return { error: "Email address is not confirmed. Check your inbox." };
      }
      return { error: error.message };
    }

    // If all good
    return { success: true };
  } catch (err: any) {
    if (err.name === "ZodError") {
      // Return all validation errors as a single message
      return {
        error: err.issues.map((issue) => issue.message).join(", "),
      };
    }
    return { error: "Unknown error occurred" };
  }
}

export async function logout(formData: FormData) {
  const locale = (formData.get("locale") as string) ?? "en";

  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect({ href: "/", locale });
}

export async function oAuthSignIn(provider: Provider, locale: string) {
  if (!provider) {
    return redirectNext("/login");
  }

  const supabase = await createClient();

  // e.g. `http://localhost:3000` in dev, no trailing slash
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.DEV_URL;
  // Possibly include the locale part:
  const redirectUrl = `${baseUrl}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        locale: locale,
        next: "/signals", // or just /signals
      },
    },
  });

  if (error) {
    return redirect({ href: `/login?error=${error.message}`, locale });
  }

  if (!data?.url) {
    return redirectNext(`/login?error=invalid_oauth_url`);
  }

  // This triggers the real OAuth flow:
  return redirectNext(data.url);
}

export async function resetPassword(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
