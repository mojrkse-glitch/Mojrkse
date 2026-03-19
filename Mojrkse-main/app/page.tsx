import { FaqPreview } from "@/components/site/faq-preview";
import { FeaturedServices } from "@/components/site/featured-services";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { Testimonials } from "@/components/site/testimonials";
import { WeatherWidget } from "@/components/site/weather-widget";
import { WhyUs } from "@/components/site/why-us";
import { getHomepageData } from "@/lib/data-access";

export default async function HomePage() {
  const { banners, featuredServices, faqs } = await getHomepageData();

  return (
    <>
      <Hero banners={banners} />
      <section className="container mx-auto max-w-7xl px-4 pt-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card p-6 md:p-8">
            <p className="text-sm font-semibold text-primary">تحسينات جديدة</p>
            <h2 className="mt-3 text-3xl font-black text-foreground">محفظة مفعّلة وتجربة أكثر تفاعلية</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">أصبح بإمكان العميل إرسال طلبات شحن الرصيد، وتستطيع الإدارة مراجعتها والموافقة أو الرفض من الباك إند. كما تمت إضافة تأثيرات Hover أكثر حيوية وروابط المطور والطقس المباشر.</p>
          </div>
          <WeatherWidget />
        </div>
      </section>
      <FeaturedServices services={featuredServices} />
      <WhyUs />
      <HowItWorks />
      <FaqPreview faqs={faqs} />
      <Testimonials />
    </>
  );
}
