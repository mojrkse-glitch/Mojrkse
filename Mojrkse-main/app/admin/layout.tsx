import Link from "next/link";
import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { isAdminUser } from "@/lib/auth";
import { Alert } from "@/components/ui/alert";

const adminNavigation = [
  { href: "/admin", label: "الرئيسية" },
  { href: "/admin/services", label: "الخدمات" },
  { href: "/admin/orders", label: "الطلبات" },
  { href: "/admin/banners", label: "البانرات" },
  { href: "/admin/payment-methods", label: "وسائل الدفع" },
  { href: "/admin/customers", label: "العملاء" },
  { href: "/admin/wallet-topups", label: "شحن الرصيد" },
  { href: "/admin/settings", label: "الإعدادات" }
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const isAdmin = await isAdminUser();
  if (!isAdmin) return <div className="container mx-auto max-w-4xl px-4 py-14"><Alert className="border-danger/20 bg-danger/10 text-white"><div className="flex items-center gap-3"><ShieldAlert className="h-5 w-5" /><div><p className="font-semibold">الوصول مرفوض</p><p className="mt-1">هذه الصفحة مخصصة للإدارة فقط. بعد ربط Supabase وتعيين دور admin في profiles ستعمل الحماية الكاملة للوحة الإدارة.</p></div></div></Alert></div>;
  return <div className="container mx-auto max-w-7xl px-4 py-10"><div className="mb-8 flex flex-wrap items-center gap-3">{adminNavigation.map((item)=><Link key={item.href} href={item.href} className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground">{item.label}</Link>)}</div>{children}</div>;
}
