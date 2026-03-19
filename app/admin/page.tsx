import Link from "next/link";
import { getAdminStats } from "@/lib/data-access";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const cards = [{ label: "عدد الطلبات", value: stats.totalOrders }, { label: "الطلبات المعلقة", value: stats.pendingOrders }, { label: "الطلبات المكتملة", value: stats.completedOrders }, { label: "عدد العملاء", value: stats.customers }, { label: "الإيرادات التقديرية", value: formatCurrency(stats.estimatedRevenue) }];
  const shortcuts = [{ href: "/admin/services", label: "إدارة الخدمات", description: "إضافة وتعديل وحذف الخدمات والحقول." }, { href: "/admin/orders", label: "إدارة الطلبات", description: "مراجعة الطلبات وعرض إثباتات الدفع وتغيير الحالة." }, { href: "/admin/payment-methods", label: "وسائل الدفع", description: "إدارة المحافظ والتعليمات وخيارات الدفع اليدوي." }, { href: "/admin/settings", label: "الإعدادات", description: "تعديل سعر الصرف ورسوم السواب." }, { href: "/admin/wallet-topups", label: "شحن الرصيد", description: "مراجعة طلبات شحن المحفظة والموافقة عليها." }];
  return <div><h1 className="text-3xl font-black text-foreground">لوحة الإدارة</h1><p className="mt-3 text-muted-foreground">لوحة تشغيل عملية لإدارة المنصة، التسعير، والطلبات اليومية.</p><div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">{cards.map((card)=><Card key={card.label}><CardContent><p className="text-sm text-muted-foreground">{card.label}</p><p className="mt-2 text-3xl font-black text-foreground">{card.value}</p></CardContent></Card>)}</div><div className="mt-8 grid gap-5 md:grid-cols-2">{shortcuts.map((item)=><Link key={item.href} href={item.href}><Card className="h-full transition hover:border-primary/40"><CardContent><h2 className="text-xl font-black text-foreground">{item.label}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p></CardContent></Card></Link>)}</div></div>;
}
