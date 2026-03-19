import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام"
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-4xl font-black text-foreground">الشروط والأحكام</h1>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-sm leading-8 text-muted-foreground">
        <p>كل طلب يتم مراجعته يدويًا، ويحق للإدارة قبول الطلب أو رفضه مع توضيح السبب عند الحاجة.</p>
        <p className="mt-4">يجب على المستخدم إدخال بيانات صحيحة ورفع إثبات دفع واضح إن كانت وسيلة الدفع تتطلب ذلك.</p>
        <p className="mt-4">الأسعار المعروضة بالدولار، وقد يتم تحويل بعض المدخلات من الليرة السورية وفق سعر الصرف المحدد من الإدارة.</p>
        <p className="mt-4">في خدمات Swap يتم احتساب رسوم خدمة تلقائية قابلة للتعديل من لوحة الإدارة.</p>
      </div>
    </div>
  );
}
