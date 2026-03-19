"use client";

import { useState, type FormEvent } from "react";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!isSupabaseConfigured()) {
      setMessage("وضع العرض مفعل. بعد إعداد Supabase سيعمل استرجاع كلمة المرور فعليًا.");
      setLoading(false);
      return;
    }

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setMessage("تعذر تهيئة الاتصال.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {message ? <Alert>{message}</Alert> : null}

      <div>
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "جارٍ الإرسال..." : "إرسال رابط الاستعادة"}
      </Button>
    </form>
  );
}
