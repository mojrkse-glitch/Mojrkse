import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-white/[0.02]">
      <div className="container mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <h3 className="text-xl font-black text-foreground">{siteConfig.name}</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            منصة عربية احترافية لطلب الخدمات الرقمية، الشحن، التصميم، والخدمات الإلكترونية.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-foreground">روابط مهمة</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/services">الخدمات</Link></li>
            <li><Link href="/faq">الأسئلة الشائعة</Link></li>
            <li><Link href="/about">من نحن</Link></li>
            <li><Link href="/contact">تواصل معنا</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-foreground">الحساب</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/login">تسجيل الدخول</Link></li>
            <li><Link href="/register">إنشاء حساب</Link></li>
            <li><Link href="/account">حسابي</Link></li>
            <li><Link href="/orders">طلباتي</Link></li>
            <li><Link href="/wallet">المحفظة</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-foreground">القانونية</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/privacy">سياسة الخصوصية</Link></li>
            <li><Link href="/terms">الشروط والأحكام</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-muted-foreground">
        جميع الحقوق محفوظة © {new Date().getFullYear()} {siteConfig.name}
      </div>
    </footer>
  );
}
