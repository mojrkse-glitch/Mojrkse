import { AdminSettingsForm } from "@/components/admin/admin-settings-form";
import { getSettings } from "@/lib/data-access";
export default async function AdminSettingsPage() { const settings = await getSettings(); return <div className="space-y-6"><div><h1 className="text-3xl font-black text-foreground">الإعدادات العامة</h1><p className="mt-3 text-muted-foreground">تحكم في سعر الصرف ونسبة رسوم السواب من مكان واحد.</p></div><AdminSettingsForm settings={settings} /></div>; }
