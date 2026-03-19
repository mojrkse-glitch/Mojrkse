import { SectionTitle } from "@/components/site/section-title";
import { demoTestimonials } from "@/lib/demo-data";

export function Testimonials() {
  return (
    <section className="container mx-auto max-w-7xl px-4 py-20">
      <SectionTitle
        eyebrow="آراء العملاء"
        title="تجارب مختصرة من مستخدمين"
        description="واجهة واضحة، حالة طلب مفهومة، ومسار تنفيذ احترافي."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {demoTestimonials.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-base leading-8 text-foreground">“{item.text}”</p>
            <div className="mt-6">
              <p className="font-bold text-foreground">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.service}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
