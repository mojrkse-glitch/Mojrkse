import { demoBanners, demoCategories, demoFaqs, demoOrders, demoPaymentMethods, demoServices, demoSettings } from "@/lib/demo-data";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { resolvePrivateFileUrl } from "@/lib/storage";
import type { Banner, Category, FaqItem, OrderSummary, PaymentMethod, ProfileSummary, Service, ServiceField, SettingsData, WalletSummary, WalletTopupSummary, WalletTransactionSummary } from "@/lib/types";

function mapFieldRow(field: any): ServiceField {
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

async function getFieldsMap(supabase: any, serviceIds: string[]) {
  if (!serviceIds.length) return new Map<string, ServiceField[]>();
  const { data: fields } = await supabase.from("service_fields").select("*").in("service_id", serviceIds);
  const map = new Map<string, ServiceField[]>();
  (fields || []).forEach((field: any) => {
    const current = map.get(field.service_id) || [];
    current.push(mapFieldRow(field));
    map.set(field.service_id, current);
  });
  for (const [key, value] of map.entries()) {
    map.set(key, value.sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)));
  }
  return map;
}

function mapServiceRows(rows: any[], categories: Category[], fieldsMap: Map<string, ServiceField[]>): Service[] {
  const categoryMap = new Map(categories.map((item) => [item.id, item.slug]));
  return rows.map((item) => ({
    ...item,
    price_usd: Number(item.price_usd || 0),
    starting_price: item.starting_price !== null ? Number(item.starting_price || 0) : null,
    category_slug: categoryMap.get(item.category_id) || "",
    fields: fieldsMap.get(item.id) || []
  }));
}

export async function getHomepageData() {
  const [banners, featuredServices, faqs] = await Promise.all([getBanners(), getFeaturedServices(), getFaqItems()]);
  return { banners, featuredServices, faqs };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return demoCategories;
  const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
  if (error || !data) return demoCategories;
  return data;
}

export async function getServices(categorySlug?: string, options: { includeInactive?: boolean } = {}): Promise<Service[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    const services = categorySlug ? demoServices.filter((service) => service.category_slug === categorySlug) : demoServices;
    return options.includeInactive ? demoServices : services.filter((service) => service.is_active);
  }

  const categories = await getCategories();
  const category = categorySlug ? categories.find((item) => item.slug === categorySlug) : null;
  let query = supabase.from("services").select("*").order("sort_order", { ascending: true });
  if (!options.includeInactive) query = query.eq("is_active", true);
  if (category) query = query.eq("category_id", category.id);

  const { data, error } = await query;
  if (error || !data) {
    const fallback = categorySlug ? demoServices.filter((service) => service.category_slug === categorySlug) : demoServices;
    return options.includeInactive ? fallback : fallback.filter((service) => service.is_active);
  }

  const fieldsMap = await getFieldsMap(supabase, data.map((item: any) => item.id));
  return mapServiceRows(data, categories, fieldsMap);
}

export async function getFeaturedServices() {
  const services = await getServices(undefined, { includeInactive: false });
  return services.filter((service) => service.is_featured).slice(0, 6);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return demoServices.find((service) => service.slug === slug) || null;
  const { data, error } = await supabase.from("services").select("*").eq("slug", slug).eq("is_active", true).maybeSingle();
  if (error || !data) return demoServices.find((service) => service.slug === slug) || null;
  const [categories, fieldsMap] = await Promise.all([getCategories(), getFieldsMap(supabase, [data.id])]);
  return mapServiceRows([data], categories, fieldsMap)[0] || null;
}

export async function getBanners(options: { includeDisabled?: boolean } = {}): Promise<Banner[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return options.includeDisabled ? demoBanners : demoBanners.filter((banner) => banner.is_enabled);
  let query = supabase.from("banners").select("*").order("sort_order", { ascending: true });
  if (!options.includeDisabled) query = query.eq("is_enabled", true);
  const { data, error } = await query;
  if (error || !data) return options.includeDisabled ? demoBanners : demoBanners.filter((banner) => banner.is_enabled);
  return data;
}

export async function getPaymentMethods(options: { includeDisabled?: boolean } = {}): Promise<PaymentMethod[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return options.includeDisabled ? demoPaymentMethods : demoPaymentMethods.filter((item) => item.is_enabled);
  let query = supabase.from("payment_methods").select("*").order("title");
  if (!options.includeDisabled) query = query.eq("is_enabled", true);
  const { data, error } = await query;
  if (error || !data) return options.includeDisabled ? demoPaymentMethods : demoPaymentMethods.filter((item) => item.is_enabled);
  return data;
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return demoFaqs;
  const { data, error } = await supabase.from("faq_items").select("*").eq("is_enabled", true).order("sort_order", { ascending: true });
  if (error || !data) return demoFaqs;
  return data;
}

export async function getSettings(): Promise<SettingsData> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return demoSettings;
  const { data, error } = await supabase.from("settings").select("key, value");
  if (error || !data) return demoSettings;
  const exchangeRate = Number(data.find((item: any) => item.key === "exchange_rate")?.value?.rate || demoSettings.exchangeRate);
  const swapFeePercentage = Number(data.find((item: any) => item.key === "swap_fee_percentage")?.value?.percentage || demoSettings.swapFeePercentage);
  return { exchangeRate, swapFeePercentage };
}

export async function getUserOrders(userId?: string | null): Promise<OrderSummary[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase || !userId) return demoOrders as OrderSummary[];
  const { data, error } = await supabase.from("orders").select("id, status, original_amount, fee_amount, final_usd_price, exchange_rate_used, rejection_reason, created_at, services(title), payment_methods(title)").eq("user_id", userId).order("created_at", { ascending: false });
  if (error || !data) return demoOrders as OrderSummary[];
  return data.map((item: any) => ({
    id: item.id,
    status: mapStatus(item.status),
    service_title: item.services?.title ?? "خدمة",
    payment_method_title: item.payment_methods?.title ?? "وسيلة دفع",
    final_usd_price: Number(item.final_usd_price || 0),
    original_amount: Number(item.original_amount || 0),
    fee_amount: Number(item.fee_amount || 0),
    exchange_rate_used: Number(item.exchange_rate_used || 0),
    rejection_reason: item.rejection_reason,
    created_at: item.created_at
  }));
}

async function hydrateOrder(data: any) {
  const supabase = await createServerSupabaseClient();
  const storageClient = createAdminSupabaseClient() || (supabase as any);
  const [serviceRes, paymentRes, detailRes, proofRes, serviceFieldsRes] = await Promise.all([
    supabase?.from("services").select("title, description").eq("id", data.service_id).maybeSingle(),
    data.payment_method_id ? supabase?.from("payment_methods").select("title, instructions").eq("id", data.payment_method_id).maybeSingle() : Promise.resolve({ data: null }),
    supabase?.from("order_details").select("field_values, reference_file_url").eq("order_id", data.id).maybeSingle(),
    supabase?.from("payment_proofs").select("file_url, file_name, mime_type").eq("order_id", data.id).limit(1).maybeSingle(),
    data.service_id ? supabase?.from("service_fields").select("field_key, field_label").eq("service_id", data.service_id) : Promise.resolve({ data: [] as any[] })
  ]);
  const referenceFileUrl = await resolvePrivateFileUrl(storageClient, "order-reference-files", detailRes?.data?.reference_file_url);
  const paymentProofUrl = await resolvePrivateFileUrl(storageClient, "payment-proofs", proofRes?.data?.file_url);
  return {
    ...data,
    status: mapStatus(data.status),
    services: { ...(serviceRes?.data || {}), fields: serviceFieldsRes?.data || [] },
    payment_methods: paymentRes?.data,
    order_details: detailRes?.data ? { ...detailRes.data, reference_file_signed_url: referenceFileUrl } : null,
    payment_proofs: proofRes?.data ? { ...proofRes.data, signed_url: paymentProofUrl } : null
  };
}

export async function getOrderById(orderId: string, userId?: string | null) {
  const supabase = await createServerSupabaseClient();
  if (!supabase || !userId) return (demoOrders as any[]).find((order) => order.id === orderId) || null;
  const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).eq("user_id", userId).maybeSingle();
  if (error || !data) return null;
  return hydrateOrder(data);
}

export async function getAdminStats() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { totalOrders: 24, pendingOrders: 7, completedOrders: 11, customers: 18, estimatedRevenue: 243 };
  const [ordersRes, profilesRes] = await Promise.all([supabase.from("orders").select("status, final_usd_price"), supabase.from("profiles").select("id")]);
  const orders = ordersRes.data || [];
  const profiles = profilesRes.data || [];
  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((item: any) => item.status === "pending_review").length,
    completedOrders: orders.filter((item: any) => item.status === "completed").length,
    customers: profiles.length,
    estimatedRevenue: orders.reduce((sum: number, item: any) => sum + Number(item.final_usd_price || 0), 0)
  };
}

export async function getAdminOrders() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return demoOrders;
  const { data, error } = await supabase.from("orders").select("id, user_id, status, final_usd_price, rejection_reason, created_at, services(title), payment_methods(title)").order("created_at", { ascending: false });
  if (error || !data) return demoOrders;
  const userIds = [...new Set(data.map((item: any) => item.user_id).filter(Boolean))];
  const { data: profiles } = userIds.length ? await supabase.from("profiles").select("id, full_name").in("id", userIds) : { data: [] as any[] };
  const profileMap = new Map((profiles || []).map((profile: any) => [profile.id, profile.full_name]));
  return data.map((item: any) => ({
    id: item.id,
    status: mapStatus(item.status),
    final_usd_price: Number(item.final_usd_price || 0),
    rejection_reason: item.rejection_reason,
    created_at: item.created_at,
    payment_method_title: item.payment_methods?.title || "غير محدد",
    service_title: item.services?.title || "خدمة",
    customer_name: profileMap.get(item.user_id) || "عميل"
  }));
}

export async function getAdminOrderById(orderId: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (error || !data) return null;
  const hydrated = await hydrateOrder(data);
  const { data: profile } = await supabase.from("profiles").select("full_name, email, phone").eq("id", data.user_id).maybeSingle();
  return { ...hydrated, customer: profile };
}

export async function getAdminCustomers(): Promise<ProfileSummary[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [{ id: "demo-customer", full_name: "عميل تجريبي", email: "demo@example.com", phone: "+963000000000", role: "user", created_at: new Date().toISOString(), orders_count: 3 }];
  const [profilesRes, ordersRes] = await Promise.all([
    supabase.from("profiles").select("id, email, full_name, phone, role, created_at").order("created_at", { ascending: false }),
    supabase.from("orders").select("user_id")
  ]);
  const ordersCountMap = new Map<string, number>();
  (ordersRes.data || []).forEach((order: any) => ordersCountMap.set(order.user_id, (ordersCountMap.get(order.user_id) || 0) + 1));
  return (profilesRes.data || []).map((profile: any) => ({ ...profile, orders_count: ordersCountMap.get(profile.id) || 0 }));
}

export function mapStatus(status: string) {
  const mapping: Record<string, any> = { pending_review: "بانتظار المراجعة", accepted: "مقبول", rejected: "مرفوض", in_progress: "قيد التنفيذ", completed: "مكتمل" };
  return mapping[status] || "بانتظار المراجعة";
}

export function mapStatusToDatabase(status: string) {
  const mapping: Record<string, string> = { "بانتظار المراجعة": "pending_review", "مقبول": "accepted", "مرفوض": "rejected", "قيد التنفيذ": "in_progress", "مكتمل": "completed" };
  return mapping[status] || "pending_review";
}


export async function getWalletSummary(userId?: string | null): Promise<WalletSummary> {
  const supabase = await createServerSupabaseClient();
  if (!supabase || !userId) {
    return { balance_usd: 0, transactions: [], pending_topups: [] };
  }

  const [walletRes, txRes, topupsRes] = await Promise.all([
    supabase.from("wallets").select("balance_usd").eq("user_id", userId).maybeSingle(),
    supabase.from("wallet_transactions").select("id, type, amount_usd, balance_after, order_id, topup_id, note, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
    supabase.from("wallet_topups").select("id, amount_usd, amount_local, exchange_rate_used, status, rejection_reason, notes, created_at, payment_methods(title)").eq("user_id", userId).order("created_at", { ascending: false }).limit(10)
  ]);

  const transactions: WalletTransactionSummary[] = (txRes.data || []).map((item: any) => ({
    id: item.id,
    type: item.type,
    amount_usd: Number(item.amount_usd || 0),
    balance_after: Number(item.balance_after || 0),
    order_id: item.order_id,
    topup_id: item.topup_id,
    note: item.note,
    created_at: item.created_at
  }));

  const pending_topups: WalletTopupSummary[] = (topupsRes.data || []).map((item: any) => ({
    id: item.id,
    amount_usd: Number(item.amount_usd || 0),
    amount_local: item.amount_local !== null ? Number(item.amount_local || 0) : null,
    exchange_rate_used: Number(item.exchange_rate_used || 0),
    status: item.status,
    rejection_reason: item.rejection_reason,
    notes: item.notes,
    payment_method_title: item.payment_methods?.title || null,
    created_at: item.created_at
  }));

  return {
    balance_usd: Number(walletRes.data?.balance_usd || 0),
    transactions,
    pending_topups
  };
}

export async function getAdminWalletTopups() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];
  const storageClient = createAdminSupabaseClient() || (supabase as any);
  const { data, error } = await supabase.from("wallet_topups").select("id, user_id, amount_usd, amount_local, exchange_rate_used, status, rejection_reason, notes, created_at, proof_file_url, payment_methods(title)").order("created_at", { ascending: false });
  if (error || !data) return [];
  const userIds = [...new Set(data.map((item: any) => item.user_id).filter(Boolean))];
  const { data: profiles } = userIds.length ? await supabase.from("profiles").select("id, full_name, email").in("id", userIds) : { data: [] as any[] };
  const profileMap = new Map((profiles || []).map((profile: any) => [profile.id, profile]));
  return Promise.all(data.map(async (item: any) => ({
    id: item.id,
    user_id: item.user_id,
    customer_name: profileMap.get(item.user_id)?.full_name || "عميل",
    customer_email: profileMap.get(item.user_id)?.email || "",
    amount_usd: Number(item.amount_usd || 0),
    amount_local: item.amount_local !== null ? Number(item.amount_local || 0) : null,
    exchange_rate_used: Number(item.exchange_rate_used || 0),
    status: item.status,
    rejection_reason: item.rejection_reason,
    notes: item.notes,
    payment_method_title: item.payment_methods?.title || "غير محدد",
    proof_signed_url: await resolvePrivateFileUrl(storageClient, "wallet-topup-proofs", item.proof_file_url),
    created_at: item.created_at
  })));
}
