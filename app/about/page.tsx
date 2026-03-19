import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن"
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-4xl font-black text-foreground">من نحن</h1>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-base leading-9 text-muted-foreground">
        <p>
          Mo.jrk هي منصة عربية متخصصة بطلب الخدمات الرقمية، صُممت لتكون نظامًا عمليًا ومنظمًا لبيع الخدمات وليس متجرًا إلكترونيًا تقليديًا.
        </p>
        <p className="mt-4">
          تجمع المنصة بين خدمات الألعاب، التصميم والمونتاج، والخدمات الإلكترونية ضمن تجربة استخدام واضحة وسريعة، مع مراجعة يدوية دقيقة لكل طلب.
        </p>
        <p className="mt-4">
          الهدف هو توفير مسار احترافي: اختيار خدمة، تعبئة تفاصيل الطلب، الدفع اليدوي، رفع الإثبات، ثم متابعة الحالة خطوة بخطوة.
        </p>
      </div>
    </div>
  );
}
