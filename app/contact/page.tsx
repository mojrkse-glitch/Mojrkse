import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { generateWhatsAppLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "تواصل معنا"
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-4xl font-black text-foreground">تواصل معنا</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-xl font-black text-foreground">الدعم عبر واتساب</h2>
          <p className="mt-4 text-sm leading-8 text-muted-foreground">
            يمكنك التواصل مباشرة للاستفسار أو التنسيق حول الطلبات اليدوية داخل مصياف - حماة.
          </p>
          <a
            href={generateWhatsAppLink(siteConfig.whatsappMessage, siteConfig.whatsappPhone)}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white"
          >
            فتح واتساب
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-xl font-black text-foreground">ملاحظات</h2>
          <ul className="mt-4 space-y-3 text-sm leading-8 text-muted-foreground">
            <li>• يتم الرد بحسب ضغط الطلبات.</li>
            <li>• جميع الطلبات داخل المنصة تمر بمراجعة يدوية.</li>
            <li>• يرجى التأكد من صحة بيانات الطلب قبل الإرسال.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
