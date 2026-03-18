import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول"
};

function LoginContent() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-14">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="mb-6">
          <p className="text-sm text-primary">أهلًا بك مجددًا</p>
          <h1 className="mt-2 text-3xl font-black text-foreground">
            تسجيل الدخول إلى حسابك
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            أدخل بياناتك للوصول إلى لوحة الحساب ومتابعة طلباتك وحالات التنفيذ.
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="font-semibold text-primary">
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-14">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-8 w-64 rounded bg-white/10" />
          <div className="h-4 w-full rounded bg-white/10" />
          <div className="h-4 w-5/6 rounded bg-white/10" />
          <div className="h-11 w-full rounded-2xl bg-white/10" />
          <div className="h-11 w-full rounded-2xl bg-white/10" />
          <div className="h-11 w-full rounded-2xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
