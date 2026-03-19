import { CheckCircle2, CreditCard, FileUp, SearchCheck } from "lucide-react";
import { SectionTitle } from "@/components/site/section-title";

const steps = [
  {
    icon: SearchCheck,
    title: "اختر الخدمة",
    description: "استعرض الأقسام والخدمات ثم افتح صفحة الخدمة المناسبة."
  },
  {
    icon: CreditCard,
    title: "املأ الطلب",
    description: "أدخل بيانات الخدمة وحدد وسيلة الدفع المناسبة."
  },
  {
    icon: FileUp,
    title: "ارفع الإثبات",
    description: "أرفق صورة إثبات الدفع أو انتقل إلى واتساب عند اختيار التسليم اليدوي."
  },
  {
    icon: CheckCircle2,
    title: "تابع الحالة",
    description: "ستظهر حالة الطلب في حسابك: بانتظار المراجعة، مقبول، مرفوض، قيد التنفيذ، مكتمل."
  }
];

export function HowItWorks() {
  return (
    <section className="container mx-auto max-w-7xl px-4 py-20">
      <SectionTitle
        eyebrow="خطوات الطلب"
        title="كيف تعمل المنصة؟"
        description="مسار الطلب مصمم ليكون واضحًا من البداية حتى اكتمال الخدمة."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-4xl font-black text-white/10">{index + 1}</span>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/15 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-lg font-black text-foreground">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
