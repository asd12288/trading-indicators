"use server";

import { createClient } from "@/database/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function emailLogin(
  formData: FormData,
  params: { params: { locale: string } },
) {
  const supabase = await createClient();

  try {
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
      console.log(error);

      if (error.message.toLowerCase().includes("confirm")) {
        const { error: linkError } = await supabase.auth.admin.generateLink({
          type: "signup",
          email,
          password: "", // added dummy password to satisfy type requirements
          options: {
            redirectTo: `${process.env.DEV_URL}/auth/confirm`, // update as needed
          },
        });
        if (linkError) {
          return {
            error: `Your email address is not confirmed, but we couldn't resend a confirmation link: ${linkError.message}`,
          };
        }

        return {
          error:
            "Your email address is not confirmed. Please check your inbox for the confirmation link.",
        };
      }

      return { error: error.message };
    }

    // Revalidate and redirect on success
    revalidatePath("/");
    redirect("/signals");
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return {
        error: err.issues.map((issue) => issue.message).join(", "),
      };
    }
    return { error: "Unknown error occurred" };
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function oAuthSignIn(provider: Provider, locale: string) {
  if (!provider) {
    redirect("/error");
  }

  const supabase = await createClient();
  // Make sure DEV_URL doesn't end with a slash
  const baseUrl = process.env.DEV_URL?.replace(/\/$/, "");
  const redirectUrl = `${baseUrl}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        locale,
        next: `/signals`, // Add locale to next path
      },
    },
  });

  if (error) {
    return redirect(`/login`);
  }

  // Make sure data.url exists before redirecting
  if (!data?.url) {
    return redirect(`/login?error=invalid_state`);
  }

  return redirect(data.url);
}

export async function resetPassword(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
