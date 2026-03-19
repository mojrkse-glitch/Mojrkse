import { AdminServicesManager } from "@/components/admin/admin-services-manager";
import { getCategories, getServices } from "@/lib/data-access";
export default async function AdminServicesPage() { const [services, categories] = await Promise.all([getServices(undefined, { includeInactive: true }), getCategories()]); return <AdminServicesManager services={services} categories={categories} />; }
