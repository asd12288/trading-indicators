"use server";

import { createClient } from "@/database/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function emailLogin(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log(error);
    redirect("/login?message=Could not sign in");
  }

  revalidatePath("/", "layout");
  redirect("/signals");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        role: "user",
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error);
    redirect("/login?message=Could not sign up");
  }

  revalidatePath("/", "layout");
  redirect("/signals");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function oAuthSignIn(provider: Provider) {
  if (!provider) {
    redirect("/error");
  }

  const supabase = await createClient();
  const redirectUrl = `http://localhost:3000/auth/callback`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: redirectUrl },
  });

  if (error) {
    console.log(error);
    redirect("/login?message=Could not sign in with provider");
  }

  redirect(data.url);
}
