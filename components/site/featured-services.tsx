import Link from "next/link";
import type { Service } from "@/lib/types";
import { SectionTitle } from "@/components/site/section-title";
import { ServiceCard } from "@/components/site/service-card";

export function FeaturedServices({ services }: { services: Service[] }) {
  return (
    <section className="container mx-auto max-w-7xl px-4 py-20">
      <SectionTitle
        eyebrow="مختارات"
        title="خدمات مميزة جاهزة للطلب"
        description="اختر من أكثر الخدمات طلبًا داخل المنصة، سواء للشحن أو التصميم أو الخدمات الإلكترونية."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/services" className="text-sm font-semibold text-primary">
          عرض جميع الخدمات
        </Link>
      </div>
    </section>
  );
}
