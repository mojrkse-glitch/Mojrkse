import Link from "next/link";
import { navigation, siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";

export async function Navbar() {
  const current = await getCurrentProfile();
  const user = current?.user;
  const isAdmin = current?.profile?.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-lg font-black text-white">M</div>
          <div>
            <p className="text-lg font-black text-foreground">{siteConfig.name}</p>
            <p className="text-xs text-muted-foreground">منصة طلب خدمات رقمية</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted-foreground transition hover:text-foreground">{item.label}</Link>
          ))}
          {isAdmin ? <Link href="/admin" className="text-sm text-primary transition hover:text-white">لوحة الإدارة</Link> : null}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/orders" className="hidden text-sm text-muted-foreground md:block">طلباتي</Link>
              {isAdmin ? <Link href="/admin" className="hidden text-sm text-muted-foreground md:block">الإدارة</Link> : null}
              <Link href="/account"><Button variant="secondary">حسابي</Button></Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm text-muted-foreground md:block">تسجيل الدخول</Link>
              <Link href="/register"><Button>إنشاء حساب</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
