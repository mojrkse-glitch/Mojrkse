import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-black text-foreground">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">الصفحة التي تبحث عنها غير موجودة.</p>
      <div className="mt-6">
        <Link href="/">
          <Button>العودة إلى الرئيسية</Button>
        </Link>
      </div>
    </div>
  );
}
