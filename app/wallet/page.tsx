import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getWalletSummary } from "@/lib/data-access";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WalletOverview } from "@/components/wallet/wallet-overview";

export const metadata: Metadata = { title: "المحفظة" };

export default async function WalletPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-14">
        <Alert>يجب تسجيل الدخول أولًا للوصول إلى المحفظة.</Alert>
        <div className="mt-6"><Link href="/login"><Button>تسجيل الدخول</Button></Link></div>
      </div>
    );
  }

  const wallet = await getWalletSummary(user.id);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">محفظتي</h1>
        <p className="mt-3 text-muted-foreground">راقب الرصيد والحركات الأخيرة وطلبات الشحن السابقة.</p>
      </div>
      <WalletOverview wallet={wallet} />
    </div>
  );
}
