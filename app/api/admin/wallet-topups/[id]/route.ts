import { NextResponse } from "next/server";
import { assertAdminAccess } from "@/lib/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await assertAdminAccess();
  if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: 403 });

  try {
    const { id } = await params;
    const body = await request.json();
    const action = String(body.action || "");

    if (action === "approve") {
      const { error } = await auth.supabase.rpc("approve_wallet_topup", { p_topup_id: id });
      if (error) return NextResponse.json({ message: error.message }, { status: 400 });
      await auth.supabase.from("admin_logs").insert({ admin_user_id: auth.userId, action: "approve_wallet_topup", target_table: "wallet_topups", target_id: id, details: { action } });
      return NextResponse.json({ message: "تمت الموافقة على طلب الشحن وإضافة الرصيد للمستخدم." });
    }

    if (action === "reject") {
      const rejectionReason = String(body.rejectionReason || "").trim() || "تم رفض طلب الشحن.";
      const { error } = await auth.supabase.from("wallet_topups").update({ status: "rejected", rejection_reason: rejectionReason, reviewed_by: auth.userId, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", id).eq("status", "pending");
      if (error) return NextResponse.json({ message: error.message }, { status: 400 });
      await auth.supabase.from("admin_logs").insert({ admin_user_id: auth.userId, action: "reject_wallet_topup", target_table: "wallet_topups", target_id: id, details: { rejectionReason } });
      return NextResponse.json({ message: "تم رفض طلب الشحن." });
    }

    return NextResponse.json({ message: "الإجراء غير صالح." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "حدث خطأ أثناء معالجة الطلب." }, { status: 500 });
  }
}
