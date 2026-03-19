import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BannerSlider } from "@/components/site/banner-slider";
import type { Banner } from "@/lib/types";

export function Hero({ banners }: { banners: Banner[] }) {
  return (
    <section className="container mx-auto max-w-7xl px-4 pt-10">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-white/10 bg-radial p-8 shadow-glow md:p-10">
          <div className="mb-6 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
            منصة Mo.jrk للخدمات الرقمية
          </div>

          <h1 className="max-w-2xl text-4xl font-black leading-tight text-foreground md:text-6xl">
            اطلب خدماتك الرقمية من مكان واحد وبخطوات واضحة وسريعة
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-9 text-muted-foreground">
            شحن ألعاب، تصميم ومونتاج، تحويلات إلكترونية، واشتراكات رقمية مع رفع إثبات الدفع وتتبع الحالة من لوحة العميل.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/services">
              <Button className="gap-2">
                اطلب الآن
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline">استعرض الخدمات</Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <Zap className="mb-3 h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">طلب سريع</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">نموذج واضح واختيار وسيلة الدفع ورفع الإثبات بسهولة.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <ShieldCheck className="mb-3 h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">مراجعة يدوية</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">كل طلب يمر عبر مراجعة الأدمن لضمان الدقة والأمان.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <Sparkles className="mb-3 h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">واجهة احترافية</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">تصميم عربي RTL فاخر ومتجاوب للموبايل وسطح المكتب.</p>
            </div>
          </div>
        </div>

        <BannerSlider banners={banners} />
      </div>
    </section>
  );
}
