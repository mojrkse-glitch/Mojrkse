import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    user,
    profile
  };
}

export async function isAdminUser() {
  const current = await getCurrentProfile();
  return current?.profile?.role === "admin";
}
