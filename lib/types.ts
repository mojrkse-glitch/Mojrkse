export type Role = "user" | "admin";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  sort_order?: number;
};

export type ServiceFieldType = "text" | "number" | "select" | "textarea" | "file";

export type ServiceField = {
  id: string;
  service_id?: string;
  field_key: string;
  field_label: string;
  field_type: ServiceFieldType;
  placeholder?: string;
  is_required: boolean;
  options?: string[];
  sort_order?: number;
};

export type Service = {
  id: string;
  category_id: string;
  category_slug: string;
  slug: string;
  title: string;
  image_url: string;
  description: string;
  price_usd: number;
  starting_price?: number | null;
  delivery_time_text?: string | null;
  is_active: boolean;
  is_featured?: boolean;
  is_swap_service?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  sort_order?: number;
  fields: ServiceField[];
};

export type Banner = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  button_text: string;
  button_link: string;
  is_enabled: boolean;
  sort_order?: number;
};

export type PaymentMethod = {
  id: string;
  slug: string;
  title: string;
  instructions: string;
  wallet_address?: string | null;
  requires_proof: boolean;
  is_hand_delivery?: boolean;
  is_enabled: boolean;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  is_enabled: boolean;
  category?: string;
  sort_order?: number;
};

export type Testimonial = {
  id: string;
  name: string;
  text: string;
  service: string;
};

export type OrderStatus =
  | "بانتظار المراجعة"
  | "مقبول"
  | "مرفوض"
  | "قيد التنفيذ"
  | "مكتمل";

export type ExchangeRate = {
  rate: number;
  base_currency: string;
  target_currency: string;
};

export type SettingsData = {
  exchangeRate: number;
  swapFeePercentage: number;
};

export type OrderSummary = {
  id: string;
  status: OrderStatus;
  service_title: string;
  payment_method_title: string;
  final_usd_price: number;
  original_amount: number;
  fee_amount: number;
  exchange_rate_used: number;
  rejection_reason?: string | null;
  created_at: string;
};

export type ProfileSummary = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  role: Role;
  created_at: string;
  orders_count?: number;
};
