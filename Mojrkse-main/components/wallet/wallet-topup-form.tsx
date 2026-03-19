"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { PaymentMethod } from "@/lib/types";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { paymentMethods: PaymentMethod[]; exchangeRate: number };

export function WalletTopupForm({ paymentMethods, exchangeRate }: Props) {
  const router = useRouter();
  const [paymentMethodId, setPaymentMethodId] = useState(paymentMethods[0]?.id || "");
  const [amountUsd, setAmountUsd] = useState("");
  const [notes, setNotes] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedMethod = paymentMethods.find((item) => item.id === paymentMethodId);
  const amountLocal = useMemo(() => {
    const usd = Number(amountUsd || 0);
    if (!usd || exchangeRate <= 0) return 0;
    return Number((usd * exchangeRate).toFixed(2));
  }, [amountUsd, exchangeRate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("paymentMethodId", paymentMethodId);
      formData.append("amountUsd", amountUsd);
      formData.append("notes", notes);
      if (proofFile) formData.append("paymentProof", proofFile);
      const res = await fetch("/api/wallet/topups", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل إرسال طلب الشحن.");
      router.push(data.redirectTo || "/wallet");
      router.refresh();
    } catch (error: any) {
      setMessage(error.message || "حدث خطأ أثناء الإرسال.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>طلب شحن رصيد</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {message ? <Alert>{message}</Alert> : null}
          <div>
            <Label htmlFor="wallet-payment-method">وسيلة الدفع</Label>
            <select id="wallet-payment-method" className="mt-2 flex h-11 w-full rounded-2xl border border-border bg-white/[0.03] px-4 text-sm text-foreground outline-none focus:border-primary/60" value={paymentMethodId} onChange={(e) => setPaymentMethodId(e.target.value)}>
              {paymentMethods.map((method) => <option key={method.id} value={method.id}>{method.title}</option>)}
            </select>
          </div>

          <div>
            <Label htmlFor="amount-usd">المبلغ بالدولار</Label>
            <Input id="amount-usd" type="number" min="1" step="0.01" value={amountUsd} onChange={(e) => setAmountUsd(e.target.value)} required />
            {amountLocal > 0 ? <p className="mt-2 text-xs text-muted-foreground">المبلغ التقريبي بالعملة المحلية: {amountLocal.toLocaleString("ar-SY")} ل.س</p> : null}
          </div>

          {selectedMethod ? <div className="rounded-2xl border border-border bg-background/70 p-4 text-sm"><p className="font-semibold text-foreground">تعليمات الدفع</p><p className="mt-2 leading-7 text-muted-foreground">{selectedMethod.instructions}</p>{selectedMethod.wallet_address ? <div className="mt-3 rounded-xl border border-primary/20 bg-primary/10 p-3 font-mono text-xs text-primary">{selectedMethod.wallet_address}</div> : null}</div> : null}

          <div>
            <Label htmlFor="wallet-proof">إثبات الدفع</Label>
            <Input id="wallet-proof" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={(e) => setProofFile(e.target.files?.[0] || null)} required={Boolean(selectedMethod?.requires_proof)} />
          </div>

          <div>
            <Label htmlFor="wallet-notes">ملاحظات</Label>
            <Textarea id="wallet-notes" placeholder="أي معلومات إضافية تساعد الإدارة في مراجعة الشحن" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>{loading ? "جارٍ إرسال طلب الشحن..." : "إرسال طلب الشحن"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
