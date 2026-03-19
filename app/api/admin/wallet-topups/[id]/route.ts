import { NextResponse } from "next/server";
import { assertAdminAccess } from "@/lib/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await assertAdminAccess();
  if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: 403 });

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const action = String(body.action || "");
  const rejectionReason = String(body.rejectionReason || "").trim();

  if (!id) return NextResponse.json({ message: "معرف الطلب غير صالح." }, { status: 400 });

  if (action === "approve") {
    const { error } = await auth.supabase.rpc("approve_wallet_topup", { p_topup_id: id });
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });
    await auth.supabase.from("admin_logs").insert({ admin_user_id: auth.userId, action: "approve_wallet_topup", target_table: "wallet_topups", target_id: id, details: { status: "approved" } });
    return NextResponse.json({ message: "تمت الموافقة على طلب الشحن وإضافة الرصيد للمستخدم." });
  }

  if (action === "reject") {
    if (!rejectionReason) return NextResponse.json({ message: "سبب الرفض مطلوب." }, { status: 400 });
    const { data: topup, error: readError } = await auth.supabase.from("wallet_topups").select("status").eq("id", id).maybeSingle();
    if (readError || !topup) return NextResponse.json({ message: "طلب الشحن غير موجود." }, { status: 404 });
    if (topup.status !== "pending") return NextResponse.json({ message: "تمت معالجة هذا الطلب مسبقًا." }, { status: 400 });
    const { error } = await auth.supabase.from("wallet_topups").update({ status: "rejected", rejection_reason: rejectionReason, reviewed_by: auth.userId, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });
    await auth.supabase.from("admin_logs").insert({ admin_user_id: auth.userId, action: "reject_wallet_topup", target_table: "wallet_topups", target_id: id, details: { status: "rejected", rejectionReason } });
    return NextResponse.json({ message: "تم رفض طلب الشحن بنجاح." });
  }

  return NextResponse.json({ message: "الإجراء غير صالح." }, { status: 400 });
}
