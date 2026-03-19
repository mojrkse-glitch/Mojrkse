import { AdminBannersManager } from "@/components/admin/admin-banners-manager";
import { getBanners } from "@/lib/data-access";
export default async function AdminBannersPage() { const banners = await getBanners({ includeDisabled: true }); return <AdminBannersManager banners={banners} />; }
