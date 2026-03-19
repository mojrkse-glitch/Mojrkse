"use client";

import type { ServiceField } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ServiceFieldsEditor({ fields, onChange }: { fields: ServiceField[]; onChange: (fields: ServiceField[]) => void; }) {
  const updateField = (id: string, key: keyof ServiceField, value: unknown) => {
    onChange(fields.map((field) => field.id === id ? { ...field, [key]: value, options: key === "options" ? (Array.isArray(value) ? value : String(value || "").split(",").map((item) => item.trim()).filter(Boolean)) : field.options } : field));
  };
  const removeField = (id: string) => onChange(fields.filter((field) => field.id !== id));
  const addField = () => onChange([...fields, { id: `field-${Math.random().toString(36).slice(2, 10)}`, field_key: "", field_label: "", field_type: "text", placeholder: "", is_required: false, options: [], sort_order: fields.length + 1 }]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-foreground">الحقول الديناميكية للخدمة</p><Button type="button" variant="outline" onClick={addField}>إضافة حقل</Button></div>
      {fields.length ? fields.map((field, index) => (
        <div key={field.id} className="space-y-3 rounded-2xl border border-border p-4">
          <div className="grid gap-3 md:grid-cols-2"><Input placeholder="اسم الحقل التقني مثل player_id" value={field.field_key} onChange={(e) => updateField(field.id, "field_key", e.target.value)} /><Input placeholder="اسم الحقل الظاهر للعميل" value={field.field_label} onChange={(e) => updateField(field.id, "field_label", e.target.value)} /></div>
          <div className="grid gap-3 md:grid-cols-3">
            <select className="flex h-11 w-full rounded-2xl border border-border bg-white/[0.03] px-4 text-sm text-foreground" value={field.field_type} onChange={(e) => updateField(field.id, "field_type", e.target.value)}>
              <option value="text">نص</option><option value="number">رقم</option><option value="select">قائمة</option><option value="textarea">منطقة نص</option><option value="file">رفع ملف</option>
            </select>
            <Input placeholder="ترتيب الظهور" type="number" value={field.sort_order || index + 1} onChange={(e) => updateField(field.id, "sort_order", Number(e.target.value || index + 1))} />
            <label className="flex h-11 items-center gap-3 rounded-2xl border border-border px-4 text-sm text-foreground"><input type="checkbox" checked={field.is_required} onChange={(e) => updateField(field.id, "is_required", e.target.checked)} />حقل إلزامي</label>
          </div>
          <Input placeholder="النص التوضيحي" value={field.placeholder || ""} onChange={(e) => updateField(field.id, "placeholder", e.target.value)} />
          {field.field_type === "select" ? <Input placeholder="خيارات القائمة مفصولة بفواصل" value={(field.options || []).join(", ")} onChange={(e) => updateField(field.id, "options", e.target.value)} /> : null}
          <div className="flex justify-end"><Button type="button" variant="danger" onClick={() => removeField(field.id)}>حذف الحقل</Button></div>
        </div>
      )) : <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">لم تتم إضافة أي حقول بعد.</div>}
    </div>
  );
}
