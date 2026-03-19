"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Layers3, Package, User, Headset } from "lucide-react";
import { cn, generateWhatsAppLink } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/site/theme-toggle";

const items = [
  { href: "/", label: "الرئيسية", icon: House },
  { href: "/services", label: "الخدمات", icon: Layers3 },
  { href: "/orders", label: "طلباتي", icon: Package },
  { href: "/account", label: "حسابي", icon: User }
];

export function MobileDock() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 px-3 py-2 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition",
                active ? "bg-primary/12 text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
        <a href={generateWhatsAppLink(siteConfig.whatsappMessage, siteConfig.whatsappPhone)} target="_blank" rel="noreferrer" className="flex flex-1 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium text-muted-foreground transition">
          <Headset className="h-4 w-4" />
          <span className="truncate">الدعم</span>
        </a>
        <div className="flex flex-col items-center gap-1 text-[11px] text-muted-foreground">
          <ThemeToggle compact />
          <span>الثيم</span>
        </div>
      </div>
    </div>
  );
}
