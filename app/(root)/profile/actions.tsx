"use server";

import { createClient } from "@/database/supabase/server";

interface ProfileUpdateResponse {
  data?: any;
  error?: Error;
}

export async function deleteSignal(
  signalId: string,
  userId: string,
): Promise<ProfileUpdateResponse> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", userId)
    .single();

  if (error) {
    return { error };
  }

  const prefs = data?.preferences || {};

  delete prefs[signalId];

  const { data: updatedData, error: updateError } = await supabase
    .from("profiles")
    .update({ preferences: prefs })
    .eq("id", userId)
    .single();

  return { updatedData, error: updateError };
}

export async function updateEmail(
  userId: string,
  prev: { username?: string },
  formData: FormData,
): Promise<ProfileUpdateResponse> {
  const supabase = await createClient();

  const data = {
    username: (formData.get("username") as string) || prev.username || "",
  };

  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .update({
        username: data.username,
      })
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    return { data: profile };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function updateAvatar(
  userId: string,
  file: File,
): Promise<ProfileUpdateResponse> {
  const supabase = await createClient();

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const { data: profile, error: updateError } = await supabase
      .from("profiles")
      .update({ avatarUrl: publicUrl.publicUrl })
      .eq("id", userId)
      .single();

    if (updateError) throw updateError;

    return { data: profile };
  } catch (error) {
    return { error: error as Error };
  }
}
