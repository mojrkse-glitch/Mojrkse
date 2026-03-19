"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WalletTopupAdminItem = {
  id: string;
  customer_name: string;
  customer_email: string;
  amount_usd: number;
  amount_local: number | null;
  payment_method_title: string;
  status: "pending" | "approved" | "rejected";
  proof_signed_url?: string | null;
  rejection_reason?: string | null;
  created_at: string;
};

export function AdminWalletTopupsManager({ topups }: { topups: WalletTopupAdminItem[] }) {
  const [rows, setRows] = useState(topups);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleReview = async (id: string, action: "approve" | "reject") => {
    const rejectionReason = action === "reject" ? window.prompt("أدخل سبب الرفض الذي سيظهر للعميل:")?.trim() || "" : "";
    if (action === "reject" && !rejectionReason) return;
    setBusyId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/wallet-topups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, rejectionReason })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل تحديث الطلب.");
      setRows((current) => current.map((item) => item.id === id ? { ...item, status: action === "approve" ? "approved" : "rejected", rejection_reason: action === "reject" ? rejectionReason : null } : item));
      setMessage(data.message || "تم تحديث الطلب بنجاح.");
    } catch (error: any) {
      setMessage(error.message || "حدث خطأ غير متوقع.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-foreground">طلبات شحن الرصيد</h1>
        <p className="mt-3 text-muted-foreground">عرض ومراجعة طلبات الشحن الحالية مع تفعيل الموافقة والرفض من الباك إند.</p>
      </div>
      {message ? <Alert>{message}</Alert> : null}
      <div className="grid gap-5">
        {rows.length ? rows.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.customer_name}</CardTitle>
              <p className="text-sm text-muted-foreground">{item.customer_email} • {formatDate(item.created_at)}</p>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-[1fr_220px]">
              <div className="grid gap-4 md:grid-cols-4">
                <div><p className="text-xs text-muted-foreground">المبلغ</p><p className="mt-2 font-semibold text-primary">{formatCurrency(item.amount_usd)}</p></div>
                <div><p className="text-xs text-muted-foreground">العملة المحلية</p><p className="mt-2 font-semibold text-foreground">{item.amount_local ? `${item.amount_local.toLocaleString("ar-SY")} ل.س` : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">الوسيلة</p><p className="mt-2 font-semibold text-foreground">{item.payment_method_title}</p></div>
                <div><p className="text-xs text-muted-foreground">الحالة</p><p className="mt-2 font-semibold text-foreground">{item.status === 'pending' ? 'بانتظار المراجعة' : item.status === 'approved' ? 'مقبول' : 'مرفوض'}</p></div>
              </div>
              <div className="flex flex-col gap-3">
                {item.proof_signed_url ? <a href={item.proof_signed_url} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full">عرض الإثبات</Button></a> : null}
                <Button className="w-full" disabled={item.status !== "pending" || busyId === item.id} onClick={() => handleReview(item.id, "approve")}>{busyId === item.id ? "جارٍ التنفيذ..." : "موافقة"}</Button>
                <Button variant="danger" className="w-full" disabled={item.status !== "pending" || busyId === item.id} onClick={() => handleReview(item.id, "reject")}>رفض</Button>
              </div>
              {item.rejection_reason ? <div className="md:col-span-2 rounded-2xl border border-danger/20 bg-danger/10 p-4 text-sm text-white">سبب الرفض: {item.rejection_reason}</div> : null}
            </CardContent>
          </Card>
        )) : <Card><CardContent><p className="text-sm text-muted-foreground">لا توجد طلبات شحن حتى الآن.</p></CardContent></Card>}
      </div>
    </div>
  );
}
