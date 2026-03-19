"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!isSupabaseConfigured()) {
      setMessage("تم تفعيل وضع العرض. أضف بيانات Supabase في البيئة لتفعيل تسجيل الدخول الحقيقي.");
      setLoading(false);
      return;
    }

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setMessage("تعذر تهيئة الاتصال.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {message ? <Alert>{message}</Alert> : null}

      <div>
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="password">كلمة المرور</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
      </Button>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <Link href="/forgot-password">نسيت كلمة المرور؟</Link>
        <Link href="/register">إنشاء حساب جديد</Link>
      </div>
    </form>
  );
}
