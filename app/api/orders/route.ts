import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calculateOrderPricing, validateDynamicValues } from "@/lib/order";
import { mapFieldRowForService } from "@/lib/server-mappers";
import { uploadPrivateFile, validateUploadedFile } from "@/lib/storage";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const uploadedFiles: Array<{ bucket: string; path: string }> = [];
  let createdOrderId: string | null = null;
  if (!supabase) return NextResponse.json({ message: "لم يتم إعداد Supabase بعد." }, { status: 500 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "يجب تسجيل الدخول أولًا." }, { status: 401 });

  try {
    const formData = await request.formData();
    const serviceId = String(formData.get("serviceId") || "");
    const paymentMode = String(formData.get("paymentMode") || "manual");
    const paymentMethodId = String(formData.get("paymentMethodId") || "");
    const notes = String(formData.get("notes") || "").trim();
    const dynamicValues = JSON.parse(String(formData.get("dynamicValues") || "{}"));
    const proofFile = formData.get("paymentProof");
    const referenceFile = formData.get("referenceFile");
    if (!serviceId) return NextResponse.json({ message: "بيانات الطلب غير مكتملة." }, { status: 400 });

    const [serviceRes, fieldsRes, settingsRes] = await Promise.all([
      supabase.from("services").select("*").eq("id", serviceId).eq("is_active", true).maybeSingle(),
      supabase.from("service_fields").select("*").eq("service_id", serviceId).order("sort_order", { ascending: true }),
      supabase.from("settings").select("key, value")
    ]);
    if (serviceRes.error || !serviceRes.data) return NextResponse.json({ message: "الخدمة غير متاحة حاليًا." }, { status: 404 });

    const settingsRows = settingsRes.data || [];
    const settings = { exchangeRate: Number(settingsRows.find((item: any) => item.key === "exchange_rate")?.value?.rate || 0), swapFeePercentage: Number(settingsRows.find((item: any) => item.key === "swap_fee_percentage")?.value?.percentage || 3) };
    const service = { ...serviceRes.data, category_slug: "", fields: (fieldsRes.data || []).map(mapFieldRowForService) };
    const reference = referenceFile instanceof File ? referenceFile : null;
    validateUploadedFile(reference, false);

    let referenceFilePath: string | null = null;
    if (reference) {
      const uploaded = await uploadPrivateFile({ admin: supabase as any, bucket: "order-reference-files", file: reference, ownerId: user.id, prefix: "reference" });
      referenceFilePath = uploaded.path;
      uploadedFiles.push({ bucket: "order-reference-files", path: uploaded.path });
    }

    if (paymentMode === "wallet") {
      validateDynamicValues({ service, paymentMethod: { id: "wallet", slug: "wallet", title: "المحفظة", instructions: "", requires_proof: false, is_enabled: true }, dynamicValues, hasProof: true } as any);
      const { data: orderId, error } = await supabase.rpc("create_wallet_order", { p_service_id: service.id, p_dynamic_values: dynamicValues, p_notes: notes || null, p_reference_file_url: referenceFilePath });
      if (error || !orderId) throw new Error(error?.message || "فشل إنشاء الطلب من الرصيد.");
      return NextResponse.json({ message: "تم إنشاء الطلب وخصم المبلغ من رصيدك بنجاح.", orderId, redirectTo: `/orders/${orderId}` });
    }

    if (!paymentMethodId) return NextResponse.json({ message: "يرجى اختيار وسيلة الدفع." }, { status: 400 });

    const { data: paymentMethod, error: paymentError } = await supabase.from("payment_methods").select("*").eq("id", paymentMethodId).eq("is_enabled", true).maybeSingle();
    if (paymentError || !paymentMethod) return NextResponse.json({ message: "وسيلة الدفع غير متاحة." }, { status: 404 });

    const paymentProof = proofFile instanceof File ? proofFile : null;
    validateUploadedFile(paymentProof, paymentMethod.requires_proof);
    validateDynamicValues({ service, paymentMethod, dynamicValues, hasProof: Boolean(paymentProof) });
    const pricing = calculateOrderPricing({ service, settings, dynamicValues });

    let paymentProofPath: string | null = null;
    let paymentProofMeta: { fileName: string; mimeType: string; fileSize: number } | null = null;

    if (paymentProof) {
      const uploaded = await uploadPrivateFile({ admin: supabase as any, bucket: "payment-proofs", file: paymentProof, ownerId: user.id, prefix: "proof" });
      paymentProofPath = uploaded.path;
      paymentProofMeta = { fileName: uploaded.fileName, mimeType: uploaded.mimeType, fileSize: uploaded.fileSize };
      uploadedFiles.push({ bucket: "payment-proofs", path: uploaded.path });
    }

    const { data: order, error: orderError } = await supabase.from("orders").insert({ user_id: user.id, service_id: service.id, payment_method_id: paymentMethodId, status: "pending_review", original_amount: pricing.originalAmount, fee_amount: pricing.feeAmount, final_usd_price: pricing.finalUsdPrice, exchange_rate_used: settings.exchangeRate, notes }).select("id").single();
    if (orderError || !order) throw new Error(orderError?.message || "فشل إنشاء الطلب.");
    createdOrderId = order.id;
    const { error: detailsError } = await supabase.from("order_details").insert({ order_id: order.id, field_values: dynamicValues, reference_file_url: referenceFilePath });
    if (detailsError) throw new Error(detailsError.message || "فشل حفظ تفاصيل الطلب.");
    if (paymentProofPath && paymentProofMeta) {
      const { error: proofError } = await supabase.from("payment_proofs").insert({ order_id: order.id, file_url: paymentProofPath, file_name: paymentProofMeta.fileName, mime_type: paymentProofMeta.mimeType, file_size: paymentProofMeta.fileSize });
      if (proofError) throw new Error(proofError.message || "فشل حفظ إثبات الدفع.");
    }
    return NextResponse.json({ message: "تم إرسال طلبك بنجاح وهو الآن بانتظار المراجعة.", orderId: order.id, redirectTo: `/orders/${order.id}` });
  } catch (error: any) {
    if (createdOrderId) await supabase.from("orders").delete().eq("id", createdOrderId);
    for (const file of uploadedFiles) await supabase.storage.from(file.bucket).remove([file.path]);
    return NextResponse.json({ message: error?.message || "حدث خطأ أثناء معالجة الطلب." }, { status: 400 });
  }
}
