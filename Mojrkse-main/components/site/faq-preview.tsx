import Link from "next/link";
import type { FaqItem } from "@/lib/types";
import { SectionTitle } from "@/components/site/section-title";

export function FaqPreview({ faqs }: { faqs: FaqItem[] }) {
  return (
    <section className="container mx-auto max-w-5xl px-4 py-20">
      <SectionTitle
        eyebrow="الأسئلة الشائعة"
        title="كل ما تحتاج معرفته قبل الطلب"
        description="أهم الأسئلة التي تساعد العميل على فهم طريقة العمل والدفع والتنفيذ."
      />

      <div className="mt-10 space-y-4">
        {faqs.slice(0, 4).map((faq) => (
          <div key={faq.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-lg font-bold text-foreground">{faq.question}</h3>
            <p className="mt-3 text-sm leading-8 text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/faq" className="text-sm font-semibold text-primary">
          عرض جميع الأسئلة الشائعة
        </Link>
      </div>
    </section>
  );
}
