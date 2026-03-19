import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/auth";
import { getWalletSummary } from "@/lib/data-access";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "حسابي"
};

export default async function AccountPage() {
  const current = await getCurrentProfile();

  if (!current?.user) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-14">
        <Alert>
          يجب تسجيل الدخول أولًا للوصول إلى لوحة الحساب.
        </Alert>
        <div className="mt-6">
          <Link href="/login">
            <Button>تسجيل الدخول</Button>
          </Link>
        </div>
      </div>
    );
  }

  const wallet = await getWalletSummary(current.user.id);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-3xl font-black text-foreground">حسابي</h1>
      <p className="mt-3 text-muted-foreground">إدارة بياناتك والانتقال السريع إلى الطلبات والمحفظة.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>معلومات الحساب</CardTitle>
            <CardDescription>بيانات المستخدم الأساسية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-2xl border border-border p-4">
              <p className="text-muted-foreground">الاسم الكامل</p>
              <p className="mt-1 font-semibold text-foreground">
                {current.profile?.full_name || "غير مضاف بعد"}
              </p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-muted-foreground">البريد الإلكتروني</p>
              <p className="mt-1 font-semibold text-foreground">{current.user.email}</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-muted-foreground">رقم الهاتف</p>
              <p className="mt-1 font-semibold text-foreground">
                {current.profile?.phone || "غير مضاف بعد"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>وصول سريع</CardTitle>
            <CardDescription>اختصارات مهمة داخل المنصة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/orders">
              <Button className="w-full">طلباتي</Button>
            </Link>
            <div className="rounded-2xl border border-border p-4 text-sm">
              <p className="text-muted-foreground">الرصيد الحالي</p>
              <p className="mt-1 text-xl font-black text-primary">{formatCurrency(wallet.balance_usd)}</p>
            </div>
            <Link href="/wallet">
              <Button variant="secondary" className="w-full">المحفظة وشحن الرصيد</Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="w-full">اطلب خدمة جديدة</Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" className="w-full">الأسئلة الشائعة</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
