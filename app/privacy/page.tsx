import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية"
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-4xl font-black text-foreground">سياسة الخصوصية</h1>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-sm leading-8 text-muted-foreground">
        <p>نقوم بجمع البيانات الضرورية فقط لتنفيذ الطلبات، مثل بيانات الحساب وبيانات الطلب وإثبات الدفع.</p>
        <p className="mt-4">لا يتم استخدام البيانات إلا لأغراض تشغيل المنصة، مراجعة الطلبات، والتواصل عند الحاجة.</p>
        <p className="mt-4">يتم تخزين الملفات والبيانات داخل Supabase وفق صلاحيات وصول محكومة بسياسات RLS.</p>
        <p className="mt-4">باستخدامك للمنصة، فإنك توافق على معالجة بياناتك ضمن الحدود المطلوبة لتنفيذ الخدمة.</p>
      </div>
    </div>
  );
}
