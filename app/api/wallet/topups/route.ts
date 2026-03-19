import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { uploadPrivateFile, validateUploadedFile } from "@/lib/storage";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const uploadedFiles: Array<{ bucket: string; path: string }> = [];
  if (!supabase) return NextResponse.json({ message: "لم يتم إعداد Supabase بعد." }, { status: 500 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "يجب تسجيل الدخول أولًا." }, { status: 401 });

  try {
    const formData = await request.formData();
    const amountUsd = Number(formData.get("amountUsd") || 0);
    const paymentMethodId = String(formData.get("paymentMethodId") || "");
    const notes = String(formData.get("notes") || "").trim();
    const proofFile = formData.get("paymentProof");

    if (!paymentMethodId || amountUsd <= 0) {
      return NextResponse.json({ message: "يرجى تحديد وسيلة الدفع وإدخال مبلغ صحيح." }, { status: 400 });
    }

    const [methodRes, settingsRes] = await Promise.all([
      supabase.from("payment_methods").select("id, title, requires_proof, is_enabled").eq("id", paymentMethodId).eq("is_enabled", true).maybeSingle(),
      supabase.from("settings").select("key, value")
    ]);

    if (methodRes.error || !methodRes.data) {
      return NextResponse.json({ message: "وسيلة الدفع غير متاحة." }, { status: 404 });
    }

    const paymentProof = proofFile instanceof File ? proofFile : null;
    validateUploadedFile(paymentProof, Boolean(methodRes.data.requires_proof));

    let paymentProofPath: string | null = null;
    let paymentProofMeta: { fileName: string; mimeType: string; fileSize: number } | null = null;

    if (paymentProof) {
      const uploaded = await uploadPrivateFile({ admin: supabase as any, bucket: "wallet-topup-proofs", file: paymentProof, ownerId: user.id, prefix: "wallet-topup" });
      paymentProofPath = uploaded.path;
      paymentProofMeta = { fileName: uploaded.fileName, mimeType: uploaded.mimeType, fileSize: uploaded.fileSize };
      uploadedFiles.push({ bucket: "wallet-topup-proofs", path: uploaded.path });
    }

    const settingsRows = settingsRes.data || [];
    const exchangeRate = Number(settingsRows.find((item: any) => item.key === "exchange_rate")?.value?.rate || 0);
    const amountLocal = exchangeRate > 0 ? Number((amountUsd * exchangeRate).toFixed(2)) : null;

    const { data, error } = await supabase.from("wallet_topups").insert({
      user_id: user.id,
      payment_method_id: paymentMethodId,
      amount_usd: Number(amountUsd.toFixed(2)),
      amount_local: amountLocal,
      exchange_rate_used: exchangeRate,
      notes,
      proof_file_url: paymentProofPath,
      proof_file_name: paymentProofMeta?.fileName || null,
      proof_mime_type: paymentProofMeta?.mimeType || null,
      proof_file_size: paymentProofMeta?.fileSize || null
    }).select("id").single();

    if (error || !data) throw new Error(error?.message || "فشل إنشاء طلب الشحن.");
    return NextResponse.json({ message: "تم إرسال طلب شحن الرصيد وهو الآن بانتظار المراجعة.", topupId: data.id, redirectTo: "/wallet" });
  } catch (error: any) {
    for (const file of uploadedFiles) await supabase.storage.from(file.bucket).remove([file.path]);
    return NextResponse.json({ message: error?.message || "حدث خطأ أثناء إنشاء طلب الشحن." }, { status: 400 });
  }
}
