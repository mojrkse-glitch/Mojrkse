import { FaqPreview } from "@/components/site/faq-preview";
import { FeaturedServices } from "@/components/site/featured-services";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { Testimonials } from "@/components/site/testimonials";
import { WhyUs } from "@/components/site/why-us";
import { getHomepageData } from "@/lib/data-access";

export default async function HomePage() {
  const { banners, featuredServices, faqs } = await getHomepageData();

  return (
    <>
      <Hero banners={banners} />
      <FeaturedServices services={featuredServices} />
      <WhyUs />
      <HowItWorks />
      <FaqPreview faqs={faqs} />
      <Testimonials />
    </>
  );
}
