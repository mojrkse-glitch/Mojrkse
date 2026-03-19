import { AdminPaymentMethodsManager } from "@/components/admin/admin-payment-methods-manager";
import { getPaymentMethods } from "@/lib/data-access";
export default async function AdminPaymentMethodsPage() { const methods = await getPaymentMethods({ includeDisabled: true }); return <AdminPaymentMethodsManager methods={methods} />; }
