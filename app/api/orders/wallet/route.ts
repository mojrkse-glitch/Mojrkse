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
    const serviceId = String(formData.get("serviceId") || "");
    const notes = String(formData.get("notes") || "").trim();
    const dynamicValues = JSON.parse(String(formData.get("dynamicValues") || "{}"));
    const referenceFile = formData.get("referenceFile");
    if (!serviceId) return NextResponse.json({ message: "بيانات الطلب غير مكتملة." }, { status: 400 });

    const reference = referenceFile instanceof File ? referenceFile : null;
    validateUploadedFile(reference, false);
    let referenceFilePath: string | null = null;
    if (reference) {
      const uploaded = await uploadPrivateFile({ admin: supabase as any, bucket: "order-reference-files", file: reference, ownerId: user.id, prefix: "reference" });
      referenceFilePath = uploaded.path;
      uploadedFiles.push({ bucket: "order-reference-files", path: uploaded.path });
    }

    const { data: orderId, error } = await supabase.rpc("create_wallet_order", {
      p_service_id: serviceId,
      p_dynamic_values: dynamicValues,
      p_notes: notes || null,
      p_reference_file_url: referenceFilePath
    });
    if (error || !orderId) throw new Error(error?.message || "فشل إنشاء الطلب من المحفظة.");
    return NextResponse.json({ message: "تم إنشاء الطلب وخصم الرصيد من المحفظة بنجاح.", orderId, redirectTo: `/orders/${orderId}` });
  } catch (error: any) {
    for (const file of uploadedFiles) await supabase.storage.from(file.bucket).remove([file.path]);
    return NextResponse.json({ message: error?.message || "حدث خطأ أثناء إنشاء الطلب من المحفظة." }, { status: 400 });
  }
}
