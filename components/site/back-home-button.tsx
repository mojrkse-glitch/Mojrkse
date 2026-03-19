import Link from "next/link";
import { ChevronRight, House } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackHomeButton({ showServices = true }: { showServices?: boolean }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <Link href="/">
        <Button variant="outline" className="gap-2">
          <House className="h-4 w-4" />
          العودة للقائمة الرئيسية
        </Button>
      </Link>
      {showServices ? (
        <Link href="/services">
          <Button variant="ghost" className="gap-2">
            <ChevronRight className="h-4 w-4" />
            الرجوع إلى الخدمات
          </Button>
        </Link>
      ) : null}
    </div>
  );
}
