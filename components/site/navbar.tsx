import Link from "next/link";
import { Menu } from "lucide-react";
import { navigation, siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { ThemeToggle } from "@/components/site/theme-toggle";

export async function Navbar() {
  const current = await getCurrentProfile();
  const user = current?.user;
  const isAdmin = current?.profile?.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="container mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:py-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-lg font-black text-white">M</div>
          <div className="min-w-0">
            <p className="truncate text-lg font-black text-foreground">{siteConfig.name}</p>
            <p className="hidden text-xs text-muted-foreground sm:block">منصة طلب خدمات رقمية</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted-foreground transition hover:text-foreground">{item.label}</Link>
          ))}
          {isAdmin ? <Link href="/admin" className="text-sm text-primary transition hover:opacity-80">لوحة الإدارة</Link> : null}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:block"><ThemeToggle /></div>
          {user ? (
            <>
              <Link href="/orders" className="hidden text-sm text-muted-foreground md:block">طلباتي</Link>
              <Link href="/wallet" className="hidden text-sm text-muted-foreground md:block">المحفظة</Link>
              {isAdmin ? <Link href="/admin" className="hidden text-sm text-muted-foreground md:block">الإدارة</Link> : null}
              <Link href="/account"><Button variant="secondary" className="px-4">حسابي</Button></Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm text-muted-foreground md:block">تسجيل الدخول</Link>
              <Link href="/register"><Button className="px-4">إنشاء حساب</Button></Link>
            </>
          )}
          <Link href="/services" className="md:hidden">
            <Button variant="outline" className="h-10 w-10 rounded-xl px-0" aria-label="الخدمات">
              <Menu className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
