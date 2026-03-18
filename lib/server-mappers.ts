import type { ServiceField } from "@/lib/types";

export function mapFieldRowForService(field: any): ServiceField {
  return {
    id: field.id,
    service_id: field.service_id,
    field_key: field.field_key,
    field_label: field.field_label,
    field_type: field.field_type,
    placeholder: field.placeholder || "",
    is_required: Boolean(field.is_required),
    options: Array.isArray(field.options) ? field.options : [],
    sort_order: Number(field.sort_order || 0)
  };
}
