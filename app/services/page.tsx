import Link from "next/link";
import type { Metadata } from "next";
import { ServiceCard } from "@/components/site/service-card";
import { SectionTitle } from "@/components/site/section-title";
import { getCategories, getServices } from "@/lib/data-access";

export const metadata: Metadata = { title: "الخدمات", description: "استعرض جميع خدمات الألعاب، التصميم، والخدمات الإلكترونية في منصة Mo.jrk" };

export default async function ServicesPage({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
  const params = (await searchParams) || {};
  const category = params.category;
  const [categories, services] = await Promise.all([getCategories(), getServices(category)]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-14">
      <SectionTitle eyebrow="الخدمات" title="جميع الخدمات المتاحة" description="اختر القسم المناسب ثم افتح الخدمة وابدأ الطلب مباشرة." />
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/services" className={`rounded-full border px-4 py-2 text-sm ${!category ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>الكل</Link>
        {categories.map((item) => <Link key={item.id} href={`/services?category=${item.slug}`} className={`rounded-full border px-4 py-2 text-sm ${category === item.slug ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{item.name}</Link>)}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{services.map((service) => <ServiceCard key={service.id} service={service} />)}</div>
    </div>
  );
}
