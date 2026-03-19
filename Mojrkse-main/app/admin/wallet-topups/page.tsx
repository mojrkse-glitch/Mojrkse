import { getAdminWalletTopups } from "@/lib/data-access";
import { AdminWalletTopupsManager } from "@/components/admin/admin-wallet-topups-manager";

export default async function AdminWalletTopupsPage() {
  const topups = await getAdminWalletTopups();
  return <AdminWalletTopupsManager topups={topups} />;
}
