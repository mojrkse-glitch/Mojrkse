import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getOrderById } from "@/lib/data-access";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "تفاصيل الطلب" };

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return <div className="container mx-auto max-w-4xl px-4 py-14"><Alert>يجب تسجيل الدخول أولًا.</Alert></div>;
  const { id } = await params;
  const order = await getOrderById(id, user.id);
  if (!order) notFound();
  const detail = Array.isArray((order as any).order_details) ? (order as any).order_details[0] : (order as any).order_details;
  const proof = Array.isArray((order as any).payment_proofs) ? (order as any).payment_proofs[0] : (order as any).payment_proofs;
  const labels = new Map((((order as any).services?.fields) || []).map((field: any) => [field.field_key, field.field_label]));

  return (
    <div className="container mx-auto max-w-5xl px-4 py-14">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div><h1 className="text-3xl font-black text-foreground">تفاصيل الطلب</h1><p className="mt-3 text-muted-foreground">رقم الطلب: {(order as any).id}</p></div>
        <Link href="/orders"><Button variant="outline">العودة إلى الطلبات</Button></Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-black text-foreground">المعلومات الأساسية</h2>
          <div className="mt-5 space-y-4 text-sm">
            <div><p className="text-muted-foreground">الخدمة</p><p className="mt-1 font-semibold text-foreground">{(order as any).services?.title || (order as any).service_title}</p></div>
            <div><p className="text-muted-foreground">الحالة</p><p className="mt-1 font-semibold text-foreground">{(order as any).status}</p></div>
            <div><p className="text-muted-foreground">تاريخ الطلب</p><p className="mt-1 font-semibold text-foreground">{formatDate((order as any).created_at)}</p></div>
            <div><p className="text-muted-foreground">المبلغ النهائي</p><p className="mt-1 font-semibold text-primary">{formatCurrency((order as any).final_usd_price)}</p></div>
            {(order as any).rejection_reason ? <div className="rounded-2xl border border-danger/20 bg-danger/10 p-4 text-white"><span className="font-semibold">سبب الرفض:</span> {(order as any).rejection_reason}</div> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-black text-foreground">تفاصيل النموذج</h2>
          <div className="mt-5 space-y-3 text-sm">
            {detail?.field_values ? Object.entries(detail.field_values).map(([key, value]) => <div key={key} className="rounded-xl border border-border p-3"><p className="text-muted-foreground">{String(labels.get(String(key)) || key)}</p><p className="mt-1 font-semibold text-foreground">{String(value)}</p></div>) : <p className="text-muted-foreground">لا توجد بيانات إضافية.</p>}
          </div>
          {detail?.reference_file_signed_url ? <a href={detail.reference_file_signed_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-secondary px-5 text-sm font-semibold">فتح الملف المرجعي</a> : null}
          {proof?.signed_url ? <a href={proof.signed_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white">عرض إثبات الدفع</a> : null}
        </div>
      </div>
    </div>
  );
}
