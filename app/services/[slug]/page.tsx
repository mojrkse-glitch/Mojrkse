import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { OrderForm } from "@/components/order/order-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPaymentMethods, getServiceBySlug, getSettings } from "@/lib/data-access";
import { formatCurrency } from "@/lib/utils";

type Params = { slug: string };

export async function generateMetadata({
  params
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "الخدمة غير موجودة"
    };
  }

  return {
    title: service.meta_title || service.title,
    description: service.meta_description || service.description,
    openGraph: {
      title: service.title,
      description: service.description,
      images: [service.image_url]
    }
  };
}

export default async function ServiceDetailsPage({
  params
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [service, paymentMethods, settings] = await Promise.all([
    getServiceBySlug(slug),
    getPaymentMethods(),
    getSettings()
  ]);

  if (!service) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-14">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="relative h-[360px] overflow-hidden rounded-[28px] border border-white/10">
            <Image src={service.image_url} alt={service.title} fill className="object-cover" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge>{service.category_slug}</Badge>
            {service.is_swap_service ? <Badge variant="warning">رسوم Swap تلقائية</Badge> : null}
          </div>

          <h1 className="mt-5 text-4xl font-black text-foreground">{service.title}</h1>
          <p className="mt-4 text-lg leading-9 text-muted-foreground">{service.description}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent>
                <p className="text-xs text-muted-foreground">السعر الابتدائي</p>
                <p className="mt-2 text-2xl font-black text-primary">
                  {service.price_usd > 0 ? formatCurrency(service.price_usd) : "حسب المبلغ"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <p className="text-xs text-muted-foreground">التسليم</p>
                <p className="mt-2 text-lg font-bold text-foreground">
                  {service.delivery_time_text || "حسب نوع الخدمة"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <p className="text-xs text-muted-foreground">سعر الصرف الحالي</p>
                <p className="mt-2 text-lg font-bold text-foreground">
                  {settings.exchangeRate.toLocaleString("ar-SY")} ل.س / $
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-xl font-black text-foreground">ما الذي ستحتاجه أثناء الطلب؟</h2>
            <ul className="mt-4 space-y-3 text-sm leading-8 text-muted-foreground">
              {service.fields.map((field) => (
                <li key={field.id}>• {field.field_label}{field.is_required ? " (إلزامي)" : ""}</li>
              ))}
              <li>• اختيار وسيلة الدفع المناسبة</li>
              <li>• رفع صورة إثبات الدفع إن كانت الوسيلة تتطلب ذلك</li>
            </ul>
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <OrderForm service={service} paymentMethods={paymentMethods} settings={settings} />
        </div>
      </div>
    </div>
  );
}
