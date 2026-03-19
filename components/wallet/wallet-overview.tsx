import Link from "next/link";
import type { WalletSummary } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

const txLabels: Record<string, string> = {
  topup_approved: "شحن رصيد",
  order_debit: "خصم طلب",
  refund: "استرجاع",
  admin_adjustment: "تعديل إداري"
};

const topupStatusVariant: Record<string, "warning" | "success" | "danger"> = {
  pending: "warning",
  approved: "success",
  rejected: "danger"
};

const topupStatusLabel: Record<string, string> = {
  pending: "بانتظار المراجعة",
  approved: "مقبول",
  rejected: "مرفوض"
};

export function WalletOverview({ wallet }: { wallet: WalletSummary }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>الرصيد الحالي</CardTitle></CardHeader>
        <CardContent>
          <p className="text-4xl font-black text-primary">{formatCurrency(wallet.balance_usd)}</p>
          <p className="mt-3 text-sm text-muted-foreground">يمكنك استخدام هذا الرصيد لطلب الخدمات مباشرة دون رفع إثبات دفع في كل مرة.</p>
          <div className="mt-5"><Link href="/services"><Button>اطلب خدمة الآن</Button></Link></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>طلبات الشحن الأخيرة</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {wallet.pending_topups.length ? wallet.pending_topups.map((topup) => (
            <div key={topup.id} className="rounded-2xl border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{formatCurrency(topup.amount_usd)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{topup.payment_method_title || 'وسيلة دفع'} • {formatDate(topup.created_at)}</p>
                </div>
                <Badge variant={topupStatusVariant[topup.status] || "warning"}>{topupStatusLabel[topup.status] || topup.status}</Badge>
              </div>
              {topup.rejection_reason ? <p className="mt-3 text-sm text-danger">سبب الرفض: {topup.rejection_reason}</p> : null}
            </div>
          )) : <p className="text-sm text-muted-foreground">لا توجد طلبات شحن حتى الآن.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>آخر الحركات</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {wallet.transactions.length ? wallet.transactions.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{txLabels[item.type] || item.type}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatDate(item.created_at)}</p>
                </div>
                <div className="text-left">
                  <p className={`font-black ${item.amount_usd >= 0 ? 'text-success' : 'text-warning'}`}>{item.amount_usd >= 0 ? '+' : ''}{formatCurrency(item.amount_usd)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">بعد الحركة: {formatCurrency(item.balance_after)}</p>
                </div>
              </div>
              {item.order_id ? <p className="mt-3 text-xs text-muted-foreground">مرجع الطلب: {item.order_id}</p> : null}
            </div>
          )) : <p className="text-sm text-muted-foreground">لا توجد حركات حتى الآن.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
