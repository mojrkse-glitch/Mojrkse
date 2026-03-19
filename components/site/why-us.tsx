import { BarChart3, CreditCard, Shield, Smartphone } from "lucide-react";
import { SectionTitle } from "@/components/site/section-title";

const items = [
  {
    icon: Shield,
    title: "مراجعة دقيقة",
    description: "كل طلب يمر عبر مراجعة يدوية قبل التنفيذ لضمان صحة البيانات والدفع."
  },
  {
    icon: CreditCard,
    title: "دفع يدوي واضح",
    description: "تعليمات مفصلة لكل وسيلة دفع مع دعم رفع صورة الإثبات داخل الطلب."
  },
  {
    icon: BarChart3,
    title: "تتبع حالة الطلب",
    description: "يمكن للعميل متابعة كل حالة من بانتظار المراجعة حتى الاكتمال."
  },
  {
    icon: Smartphone,
    title: "مصمم للموبايل",
    description: "تجربة استخدام سريعة جدًا ومصممة أولًا للأجهزة المحمولة."
  }
];

export function WhyUs() {
  return (
    <section className="container mx-auto max-w-7xl px-4 py-20">
      <SectionTitle
        eyebrow="لماذا نحن"
        title="منصة مصممة لطلبات الخدمات الرقمية"
        description="المنصة ليست متجرًا تقليديًا، بل نظام طلبات واضح يساعد العميل والأدمن على إدارة الطلبات بسهولة."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
