"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminWalletTopupsManager({ topups }: { topups: any[] }) {
  const [items, setItems] = useState(topups);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const submitAction = async (id: string, action: "approve" | "reject") => {
    setLoadingId(id);
    setMessage(null);
    try {
      const rejectionReason = action === "reject" ? window.prompt("أدخل سبب الرفض") || "تم رفض طلب الشحن." : undefined;
      const res = await fetch(`/api/admin/wallet-topups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, rejectionReason })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل تحديث الطلب.");
      setMessage(data.message || "تم الحفظ.");
      setItems((current) => current.map((item) => item.id === id ? { ...item, status: action === "approve" ? "approved" : "rejected", rejection_reason: rejectionReason || item.rejection_reason } : item));
    } catch (error: any) {
      setMessage(error.message || "حدث خطأ أثناء معالجة الطلب.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-foreground">طلبات شحن الرصيد</h1>
        <p className="mt-3 text-muted-foreground">راجع طلبات الشحن ثم وافق عليها لإضافة الرصيد تلقائيًا إلى محفظة العميل.</p>
      </div>
      {message ? <Alert>{message}</Alert> : null}
      <div className="grid gap-5">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.customer_name}</CardTitle>
              <p className="text-sm text-muted-foreground">{item.customer_email} • {formatDate(item.created_at)}</p>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-[1fr_260px]">
              <div className="grid gap-4 md:grid-cols-4">
                <div><p className="text-xs text-muted-foreground">المبلغ</p><p className="mt-2 font-semibold text-primary">{formatCurrency(item.amount_usd)}</p></div>
                <div><p className="text-xs text-muted-foreground">العملة المحلية</p><p className="mt-2 font-semibold text-foreground">{item.amount_local ? `${item.amount_local.toLocaleString("ar-SY")} ل.س` : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">الوسيلة</p><p className="mt-2 font-semibold text-foreground">{item.payment_method_title}</p></div>
                <div><p className="text-xs text-muted-foreground">الحالة</p><p className="mt-2 font-semibold text-foreground">{item.status === 'pending' ? 'بانتظار المراجعة' : item.status === 'approved' ? 'مقبول' : 'مرفوض'}</p></div>
              </div>
              <div className="flex flex-col gap-3">
                {item.proof_signed_url ? <a href={item.proof_signed_url} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full">عرض إثبات الدفع</Button></a> : null}
                <Button onClick={() => submitAction(item.id, 'approve')} disabled={loadingId === item.id || item.status !== 'pending'}>موافقة وإضافة الرصيد</Button>
                <Button variant="danger" onClick={() => submitAction(item.id, 'reject')} disabled={loadingId === item.id || item.status !== 'pending'}>رفض الطلب</Button>
              </div>
              {item.rejection_reason ? <div className="md:col-span-2 rounded-2xl border border-danger/20 bg-danger/10 p-4 text-sm text-white">سبب الرفض: {item.rejection_reason}</div> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
