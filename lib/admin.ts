import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function assertAdminAccess() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { ok: false as const, message: "لم يتم إعداد Supabase بشكل كامل." };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, message: "يجب تسجيل الدخول أولًا." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { ok: false as const, message: "الوصول مخصص للإدارة فقط." };
  }

  return { ok: true as const, userId: user.id, supabase };
}
