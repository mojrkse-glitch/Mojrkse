"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

const statuses = ["بانتظار المراجعة", "مقبول", "مرفوض", "قيد التنفيذ", "مكتمل"];

export function AdminStatusSelect({ orderId, currentStatus, currentRejectionReason }: { orderId: string; currentStatus: string; currentRejectionReason?: string | null; }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [rejectionReason, setRejectionReason] = useState(currentRejectionReason || "");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    setMessage(null); setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, rejectionReason: status === "مرفوض" ? rejectionReason : null }) });
    const data = await res.json();
    setMessage(data.message || (res.ok ? "تم تحديث حالة الطلب." : "فشل التحديث."));
    setLoading(false);
    if (res.ok) router.refresh();
  };

  return (
    <div className="space-y-3">
      {message ? <Alert>{message}</Alert> : null}
      <select className="flex h-11 w-full rounded-2xl border border-border bg-white/[0.03] px-4 text-sm text-foreground" value={status} onChange={(e) => setStatus(e.target.value)}>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      {status === "مرفوض" ? <textarea className="min-h-[110px] w-full rounded-2xl border border-border bg-white/[0.03] p-4 text-sm text-foreground" placeholder="سبب الرفض" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} /> : null}
      <Button type="button" variant="secondary" onClick={updateStatus} disabled={loading}>{loading ? "جارٍ الحفظ..." : "حفظ الحالة"}</Button>
    </div>
  );
}
