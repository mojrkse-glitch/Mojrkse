"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { generateWhatsAppLink } from "@/lib/utils";

const faqItems = [
  {
    q: "كيف أطلب خدمة؟",
    a: "اختر الخدمة، املأ النموذج، ارفع إثبات الدفع، ثم انتظر المراجعة."
  },
  {
    q: "هل التنفيذ تلقائي؟",
    a: "التنفيذ يدوي حاليًا، مع إمكانية تطوير بعض المسارات لاحقًا."
  },
  {
    q: "هل يمكن معرفة سبب الرفض؟",
    a: "نعم، يظهر سبب الرفض داخل تفاصيل الطلب."
  }
];

export function SupportWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 left-4 z-50 md:bottom-4">
      {open ? (
        <div className="mb-3 w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-background p-4 shadow-glow">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground">الدعم السريع</h3>
              <p className="text-xs text-muted-foreground">مركز أسئلة ومساعدة فورية</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-xl border border-border bg-white/[0.02] p-3">
                <p className="font-semibold text-foreground">{item.q}</p>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>

          <a
            href={generateWhatsAppLink(siteConfig.whatsappMessage, siteConfig.whatsappPhone)}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white"
          >
            تواصل عبر واتساب
          </a>
        </div>
      ) : null}

      <button
        onClick={() => setOpen((value) => !value)}
        className="grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-glow"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
