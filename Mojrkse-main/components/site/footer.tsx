import Link from "next/link";
import { Facebook, Instagram, MessageCircleMore } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { generateWhatsAppLink } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-white/[0.02]">
      <div className="container mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4 md:py-12">
        <div>
          <h3 className="text-xl font-black text-foreground">{siteConfig.name}</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            منصة عربية احترافية لطلب الخدمات الرقمية، الشحن، التصميم، والخدمات الإلكترونية.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={siteConfig.developer.facebookUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2 text-sm interactive-surface">
              <Facebook className="h-4 w-4" /> فيسبوك
            </a>
            <a href={siteConfig.developer.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2 text-sm interactive-surface">
              <Instagram className="h-4 w-4" /> إنستغرام
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-foreground">روابط مهمة</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link className="interactive-link" href="/">الرئيسية</Link></li>
            <li><Link className="interactive-link" href="/services">الخدمات</Link></li>
            <li><Link className="interactive-link" href="/wallet">المحفظة</Link></li>
            <li><Link className="interactive-link" href="/faq">الأسئلة الشائعة</Link></li>
            <li><Link className="interactive-link" href="/about">من نحن</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-foreground">الحساب</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link className="interactive-link" href="/login">تسجيل الدخول</Link></li>
            <li><Link className="interactive-link" href="/register">إنشاء حساب</Link></li>
            <li><Link className="interactive-link" href="/account">حسابي</Link></li>
            <li><Link className="interactive-link" href="/orders">طلباتي</Link></li>
            <li><Link className="interactive-link" href="/wallet">المحفظة</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-foreground">مطور الموقع</h4>
          <p className="text-sm leading-7 text-muted-foreground">تمت إضافة أزرار المطور لتسهيل التواصل المباشر عبر المنصات الاجتماعية.</p>
          <div className="mt-4 space-y-3 text-sm">
            <a href={siteConfig.developer.facebookUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 interactive-surface">
              <span className="flex items-center gap-2"><Facebook className="h-4 w-4" /> صفحة فيسبوك</span>
              <span>↗</span>
            </a>
            <a href={siteConfig.developer.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 interactive-surface">
              <span className="flex items-center gap-2"><Instagram className="h-4 w-4" /> صفحة إنستغرام</span>
              <span>↗</span>
            </a>
            <a href={generateWhatsAppLink(siteConfig.whatsappMessage, siteConfig.whatsappPhone)} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 interactive-surface">
              <span className="flex items-center gap-2"><MessageCircleMore className="h-4 w-4" /> واتساب</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-sm text-muted-foreground">
        جميع الحقوق محفوظة © {new Date().getFullYear()} {siteConfig.name}
      </div>
    </footer>
  );
}
