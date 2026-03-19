import { formatCurrency, formatDate } from "@/lib/utils";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminWalletTopupsManager({ topups }: { topups: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-foreground">طلبات شحن الرصيد</h1>
        <p className="mt-3 text-muted-foreground">عرض ومراجعة طلبات الشحن الحالية.</p>
      </div>
      <Alert>هذه الصفحة تعرض الطلبات الحالية. زر الموافقة والرفض يحتاج تفعيل API المحفظة في قاعدة البيانات.</Alert>
      <div className="grid gap-5">
        {topups.length ? topups.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.customer_name}</CardTitle>
              <p className="text-sm text-muted-foreground">{item.customer_email} • {formatDate(item.created_at)}</p>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-[1fr_220px]">
              <div className="grid gap-4 md:grid-cols-4">
                <div><p className="text-xs text-muted-foreground">المبلغ</p><p className="mt-2 font-semibold text-primary">{formatCurrency(item.amount_usd)}</p></div>
                <div><p className="text-xs text-muted-foreground">العملة المحلية</p><p className="mt-2 font-semibold text-foreground">{item.amount_local ? `${item.amount_local.toLocaleString("ar-SY")} ل.س` : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">الوسيلة</p><p className="mt-2 font-semibold text-foreground">{item.payment_method_title}</p></div>
                <div><p className="text-xs text-muted-foreground">الحالة</p><p className="mt-2 font-semibold text-foreground">{item.status === 'pending' ? 'بانتظار المراجعة' : item.status === 'approved' ? 'مقبول' : 'مرفوض'}</p></div>
              </div>
              <div className="flex flex-col gap-3">
                {item.proof_signed_url ? <a href={item.proof_signed_url} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full">عرض الإثبات</Button></a> : null}
                <Button className="w-full" disabled>موافقة</Button>
                <Button variant="danger" className="w-full" disabled>رفض</Button>
              </div>
              {item.rejection_reason ? <div className="md:col-span-2 rounded-2xl border border-danger/20 bg-danger/10 p-4 text-sm text-white">سبب الرفض: {item.rejection_reason}</div> : null}
            </CardContent>
          </Card>
        )) : <Card><CardContent><p className="text-sm text-muted-foreground">لا توجد طلبات شحن حتى الآن.</p></CardContent></Card>}
      </div>
    </div>
  );
}
