import type { PaymentMethod, Service, ServiceField, SettingsData } from "@/lib/types";
import { calculateSwapFee } from "@/lib/money";

export function normalizeServiceFields(fields: unknown): ServiceField[] {
  if (!Array.isArray(fields)) return [];

  const normalized = fields.map((field, index) => {
    const current = field as Record<string, unknown>;
    const fieldType = String(current.field_type || "text") as ServiceField["field_type"];
    const supportedTypes = ["text", "number", "select", "textarea", "file"];
    if (!supportedTypes.includes(fieldType)) return null;

    const options = Array.isArray(current.options)
      ? current.options.map((item) => String(item).trim()).filter(Boolean)
      : [];

    return {
      id: String(current.id || `field-${index + 1}`),
      field_key: String(current.field_key || "").trim(),
      field_label: String(current.field_label || "").trim(),
      field_type: fieldType,
      placeholder: current.placeholder ? String(current.placeholder) : "",
      is_required: Boolean(current.is_required),
      options,
      sort_order: Number(current.sort_order ?? index + 1)
    };
  });

  return normalized.filter(Boolean).filter((field) => Boolean((field as ServiceField).field_key && (field as ServiceField).field_label)) as ServiceField[];
}

export function calculateOrderPricing({ service, settings, dynamicValues }: { service: Service; settings: SettingsData; dynamicValues: Record<string, unknown>; }) {
  if (service.is_swap_service) {
    const rawAmount = Number(dynamicValues.transfer_amount || dynamicValues.amount || 0);
    if (!rawAmount || rawAmount <= 0) throw new Error("أدخل مبلغ التحويل بشكل صحيح.");
    const { fee, finalAmount } = calculateSwapFee(rawAmount, settings.swapFeePercentage);
    return {
      originalAmount: Number(rawAmount.toFixed(2)),
      feeAmount: fee,
      finalUsdPrice: finalAmount,
      pricingMode: "swap"
    } as const;
  }

  const servicePrice = Number(service.price_usd || service.starting_price || 0);
  if (servicePrice <= 0) throw new Error("الخدمة لا تحتوي سعرًا صالحًا حاليًا.");
  return {
    originalAmount: servicePrice,
    feeAmount: 0,
    finalUsdPrice: servicePrice,
    pricingMode: "fixed"
  } as const;
}

export function validateDynamicValues({ service, paymentMethod, dynamicValues, hasProof }: { service: Service; paymentMethod: PaymentMethod; dynamicValues: Record<string, unknown>; hasProof: boolean; }) {
  for (const field of service.fields) {
    const value = dynamicValues[field.field_key];
    if (field.is_required) {
      const isEmpty = value === null || value === undefined || (typeof value === "string" && value.trim() === "") || (field.field_type === "file" && !value);
      if (isEmpty) throw new Error(`الحقل المطلوب غير مكتمل: ${field.field_label}`);
    }
  }
  if (paymentMethod.requires_proof && !hasProof) {
    throw new Error("هذه الوسيلة تتطلب رفع صورة أو ملف إثبات الدفع.");
  }
}
