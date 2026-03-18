import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={service.image_url}
          alt={service.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <CardContent>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-foreground">{service.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{service.description}</p>
          </div>
          {service.is_swap_service ? <Badge variant="warning">Swap</Badge> : null}
        </div>

        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">السعر</p>
            <p className="text-lg font-black text-foreground">
              {service.price_usd > 0 ? formatCurrency(service.price_usd) : "حسب المبلغ"}
            </p>
          </div>
          {service.delivery_time_text ? (
            <div className="text-left">
              <p className="text-xs text-muted-foreground">مدة التسليم</p>
              <p className="text-sm font-semibold text-foreground">{service.delivery_time_text}</p>
            </div>
          ) : null}
        </div>

        <Link
          href={`/services/${service.slug}`}
          className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          تفاصيل الخدمة
        </Link>
      </CardContent>
    </Card>
  );
}
