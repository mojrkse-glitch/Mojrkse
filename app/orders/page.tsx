import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getUserOrders } from "@/lib/data-access";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "طلباتي"
};

const badgeVariantMap: Record<string, "default" | "success" | "warning" | "danger" | "muted"> = {
  "بانتظار المراجعة": "warning",
  "مقبول": "default",
  "قيد التنفيذ": "default",
  "مكتمل": "success",
  "مرفوض": "danger"
};

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-14">
        <Alert>يجب تسجيل الدخول أولًا لعرض الطلبات.</Alert>
        <div className="mt-6">
          <Link href="/login">
            <Button>تسجيل الدخول</Button>
          </Link>
        </div>
      </div>
    );
  }

  const orders = await getUserOrders(user.id);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">طلباتي</h1>
        <p className="mt-3 text-muted-foreground">تابع حالة كل طلب، واطلع على سبب الرفض إن وجد.</p>
      </div>

      <div className="grid gap-5">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>{order.service_title}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
              </div>
              <Badge variant={badgeVariantMap[order.status] || "muted"}>{order.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">وسيلة الدفع</p>
                  <p className="mt-2 font-semibold text-foreground">{order.payment_method_title}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">المبلغ الأصلي</p>
                  <p className="mt-2 font-semibold text-foreground">{formatCurrency(order.original_amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">الرسوم</p>
                  <p className="mt-2 font-semibold text-foreground">{formatCurrency(order.fee_amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">الإجمالي النهائي</p>
                  <p className="mt-2 font-black text-primary">{formatCurrency(order.final_usd_price)}</p>
                </div>
              </div>

              {order.rejection_reason ? (
                <div className="mt-5 rounded-2xl border border-danger/20 bg-danger/10 p-4 text-sm text-white">
                  <span className="font-semibold">سبب الرفض:</span> {order.rejection_reason}
                </div>
              ) : null}

              <div className="mt-5">
                <Link href={`/orders/${order.id}`}>
                  <Button variant="outline">تفاصيل الطلب</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
