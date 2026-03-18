import type { Metadata } from "next";
import { SectionTitle } from "@/components/site/section-title";
import { getFaqItems } from "@/lib/data-access";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة"
};

export default async function FaqPage() {
  const faqs = await getFaqItems();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-14">
      <SectionTitle
        title="الأسئلة الشائعة"
        description="إجابات سريعة وواضحة عن طريقة العمل، الدفع، والحالات."
      />

      <div className="mt-10 space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-bold text-foreground">{faq.question}</h2>
            <p className="mt-3 text-sm leading-8 text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
