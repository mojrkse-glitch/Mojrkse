"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { PaymentMethod, Service } from "@/lib/types";
import { calculateSwapFee } from "@/lib/money";
import { siteConfig } from "@/lib/site";
import { formatCurrency, generateWhatsAppLink } from "@/lib/utils";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  service: Service;
  paymentMethods: PaymentMethod[];
  settings: { exchangeRate: number; swapFeePercentage: number };
  walletBalanceUsd?: number;
};

export function OrderForm({ service, paymentMethods, settings, walletBalanceUsd = 0 }: Props) {
  const router = useRouter();
  const [paymentMode, setPaymentMode] = useState<"wallet" | "manual">("manual");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]?.id || "");
  const [notes, setNotes] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const swapInput = Number(dynamicValues.transfer_amount || dynamicValues.amount || service.price_usd || 0);
  const selectedMethod = paymentMethods.find((method) => method.id === selectedPaymentMethod);
  const isHandDelivery = Boolean(selectedMethod?.is_hand_delivery);

  const pricing = useMemo(() => {
    if (service.is_swap_service) {
      const { fee, finalAmount } = calculateSwapFee(Number.isFinite(swapInput) ? swapInput : 0, settings.swapFeePercentage);
      return { originalAmount: swapInput || 0, fee, finalUsdPrice: finalAmount };
    }
    return { originalAmount: service.price_usd, fee: 0, finalUsdPrice: service.price_usd };
  }, [service, settings.swapFeePercentage, swapInput]);

  const walletEnough = walletBalanceUsd >= pricing.finalUsdPrice && pricing.finalUsdPrice > 0;
  const updateField = (key: string, value: string) => setDynamicValues((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload = new FormData();
      payload.append("serviceId", service.id);
      payload.append("paymentMode", paymentMode);
      payload.append("paymentMethodId", selectedPaymentMethod);
      payload.append("notes", notes);
      payload.append("dynamicValues", JSON.stringify(dynamicValues));
      if (proofFile) payload.append("paymentProof", proofFile);
      if (referenceFile) payload.append("referenceFile", referenceFile);
      const res = await fetch("/api/orders", { method: "POST", body: payload });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/login?next=/services/${service.slug}`);
          return;
        }
        throw new Error(data.message || "فشل إرسال الطلب.");
      }
      setMessage(data.message || "تم إرسال الطلب بنجاح.");
      router.push(data.redirectTo || "/orders");
      router.refresh();
    } catch (error: any) {
      setMessage(error.message || "حدث خطأ أثناء إرسال الطلب.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message ? <Alert>{message}</Alert> : null}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">تفاصيل التسعير</h3>
            <p className="text-sm text-muted-foreground">المعاينة هنا للعرض فقط، والسعر النهائي يحتسب من السيرفر عند إنشاء الطلب.</p>
          </div>
          {service.is_swap_service ? <Badge variant="warning">رسوم {settings.swapFeePercentage}%</Badge> : null}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background/70 p-4"><p className="text-xs text-muted-foreground">المبلغ الأصلي</p><p className="mt-2 text-xl font-black text-foreground">{formatCurrency(pricing.originalAmount)}</p></div>
          <div className="rounded-2xl border border-border bg-background/70 p-4"><p className="text-xs text-muted-foreground">الرسوم</p><p className="mt-2 text-xl font-black text-foreground">{formatCurrency(pricing.fee)}</p></div>
          <div className="rounded-2xl border border-border bg-background/70 p-4"><p className="text-xs text-muted-foreground">الإجمالي النهائي</p><p className="mt-2 text-xl font-black text-primary">{formatCurrency(pricing.finalUsdPrice)}</p></div>
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h3 className="text-lg font-bold text-foreground">بيانات الطلب</h3>

        <div>
          <Label>طريقة الدفع</Label>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <button type="button" onClick={() => setPaymentMode("manual")} className={`rounded-2xl border p-4 text-right transition ${paymentMode === "manual" ? "border-primary bg-primary/10" : "border-border bg-background/40"}`}>
              <p className="font-semibold text-foreground">دفع يدوي</p>
              <p className="mt-1 text-sm text-muted-foreground">رفع إثبات الدفع لكل طلب حسب الوسيلة المحددة.</p>
            </button>
            <button type="button" onClick={() => setPaymentMode("wallet")} className={`rounded-2xl border p-4 text-right transition ${paymentMode === "wallet" ? "border-primary bg-primary/10" : "border-border bg-background/40"}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-foreground">الدفع من الرصيد</p>
                <Badge variant={walletEnough ? "success" : "warning"}>{formatCurrency(walletBalanceUsd)}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">يتم الخصم تلقائيًا من محفظتك مباشرة عند تأكيد الطلب.</p>
            </button>
          </div>
          {paymentMode === "wallet" && !walletEnough ? <p className="mt-3 text-sm text-warning">رصيدك الحالي غير كافٍ. يمكنك شحن المحفظة من صفحة الرصيد ثم العودة لإتمام الطلب.</p> : null}
        </div>

        {service.fields.map((field) => (
          <div key={field.id}>
            <Label htmlFor={field.field_key}>{field.field_label}</Label>
            {field.field_type === "textarea" ? (
              <Textarea id={field.field_key} placeholder={field.placeholder} value={dynamicValues[field.field_key] || ""} onChange={(e) => updateField(field.field_key, e.target.value)} required={field.is_required} />
            ) : field.field_type === "select" ? (
              <select id={field.field_key} className="flex h-11 w-full rounded-2xl border border-border bg-white/[0.03] px-4 text-sm text-foreground outline-none focus:border-primary/60" value={dynamicValues[field.field_key] || ""} onChange={(e) => updateField(field.field_key, e.target.value)} required={field.is_required}>
                <option value="">اختر</option>
                {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : field.field_type === "file" ? (
              <Input id={field.field_key} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={(e) => setReferenceFile(e.target.files?.[0] || null)} required={field.is_required} />
            ) : (
              <Input id={field.field_key} type={field.field_type === "number" ? "number" : "text"} placeholder={field.placeholder} value={dynamicValues[field.field_key] || ""} onChange={(e) => updateField(field.field_key, e.target.value)} required={field.is_required} />
            )}
          </div>
        ))}

        {paymentMode === "manual" ? (
          <>
            <div>
              <Label htmlFor="payment-method">وسيلة الدفع</Label>
              <select id="payment-method" className="flex h-11 w-full rounded-2xl border border-border bg-white/[0.03] px-4 text-sm text-foreground outline-none focus:border-primary/60" value={selectedPaymentMethod} onChange={(e) => setSelectedPaymentMethod(e.target.value)}>
                {paymentMethods.map((method) => <option key={method.id} value={method.id}>{method.title}</option>)}
              </select>
            </div>

            {selectedMethod ? <div className="rounded-2xl border border-border bg-background/70 p-4 text-sm"><p className="font-semibold text-foreground">تعليمات الدفع</p><p className="mt-2 leading-7 text-muted-foreground">{selectedMethod.instructions}</p>{selectedMethod.wallet_address ? <div className="mt-3 rounded-xl border border-primary/20 bg-primary/10 p-3 font-mono text-xs text-primary">{selectedMethod.wallet_address}</div> : null}</div> : null}
            {isHandDelivery ? <a href={generateWhatsAppLink(siteConfig.whatsappMessage, siteConfig.whatsappPhone)} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center rounded-2xl bg-secondary px-5 text-sm font-semibold text-secondary-foreground">فتح واتساب للتنسيق</a> : null}
            {selectedMethod?.requires_proof ? <div><Label htmlFor="payment-proof">إثبات الدفع</Label><Input id="payment-proof" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={(e) => setProofFile(e.target.files?.[0] || null)} required={selectedMethod.requires_proof} /><p className="mt-2 text-xs text-muted-foreground">الصيغ المدعومة: JPG, PNG, WEBP, PDF — الحد الأقصى 5MB.</p></div> : null}
          </>
        ) : (
          <div className="rounded-2xl border border-success/20 bg-success/10 p-4 text-sm text-foreground">
            سيتم إنشاء الطلب مباشرة وخصم المبلغ من رصيدك عند نجاح العملية.
          </div>
        )}

        <div><Label htmlFor="notes">ملاحظات إضافية</Label><Textarea id="notes" placeholder="أضف أي توضيحات تساعد على تنفيذ الطلب بدقة" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        <Button type="submit" className="w-full" disabled={loading || (paymentMode === "wallet" && !walletEnough)}>{loading ? "جارٍ إرسال الطلب..." : paymentMode === "wallet" ? "تأكيد الطلب والخصم من الرصيد" : "إرسال الطلب الآن"}</Button>
      </div>
    </form>
  );
}
