// Example function to save user preferences for a specific signal in "profiles"
// filepath: /path/to/file

import { createClient } from "@/database/supabase/server";

export async function saveSignalPreferences({
  userId,
  signalId,
  notifications,
  volume,
  favorite,
}: {
  userId: string;
  signalId: string;
  notifications: boolean;
  volume: boolean;
  favorite: boolean;
}) {
  const supabase = await createClient();

  // 1. Fetch the current preferences from the user's row
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    console.error("Error fetching profile:", profileError);
    return null;
  }

  // 2. Merge or create the preferences object
  const existingPrefs = profile.preferences || {};
  const updatedPrefs = {
    ...existingPrefs,
    [signalId]: {
      notifications,
      volume,
      favorite,
    },
  };

  // 3. Update the user's row with new preferences
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ preferences: updatedPrefs })
    .eq("id", userId);

  if (updateError) {
    console.error("Error updating preferences:", updateError);
    return null;
  }

  return { success: true };
}
