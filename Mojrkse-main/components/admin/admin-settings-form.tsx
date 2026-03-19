"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SettingsData } from "@/lib/types";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AdminSettingsForm({ settings }: { settings: SettingsData }) {
  const router = useRouter();
  const [exchangeRate, setExchangeRate] = useState(String(settings.exchangeRate || 0));
  const [swapFeePercentage, setSwapFeePercentage] = useState(String(settings.swapFeePercentage || 3));
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    setLoading(true); setMessage(null);
    const res = await fetch("/api/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ exchangeRate: Number(exchangeRate || 0), swapFeePercentage: Number(swapFeePercentage || 0) }) });
    const data = await res.json(); setMessage(data.message || (res.ok ? "تم الحفظ." : "تعذر الحفظ.")); setLoading(false); if (res.ok) router.refresh();
  };
  return <Card><CardHeader><CardTitle>الإعدادات المالية العامة</CardTitle></CardHeader><CardContent className="space-y-4">{message ? <Alert>{message}</Alert> : null}<Input placeholder="سعر الصرف SYP → USD" type="number" value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)} /><Input placeholder="رسوم السواب %" type="number" value={swapFeePercentage} onChange={(e) => setSwapFeePercentage(e.target.value)} /><Button type="button" onClick={submit} disabled={loading}>{loading ? "جارٍ الحفظ..." : "حفظ الإعدادات"}</Button></CardContent></Card>;
}
