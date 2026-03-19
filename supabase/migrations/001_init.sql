create extension if not exists "pgcrypto";

create type public.user_role as enum ('user', 'admin');
create type public.order_status as enum ('pending_review', 'accepted', 'rejected', 'in_progress', 'completed');

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'user'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  slug text not null unique,
  title text not null,
  image_url text,
  description text not null,
  price_usd numeric(12,2) not null default 0,
  starting_price numeric(12,2),
  delivery_time_text text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_swap_service boolean not null default false,
  meta_title text,
  meta_description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_fields (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  field_key text not null,
  field_label text not null,
  field_type text not null check (field_type in ('text', 'number', 'select', 'textarea', 'file')),
  placeholder text,
  is_required boolean not null default false,
  options jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  instructions text,
  wallet_address text,
  requires_proof boolean not null default true,
  is_hand_delivery boolean not null default false,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete restrict,
  payment_method_id uuid references public.payment_methods(id) on delete set null,
  status public.order_status not null default 'pending_review',
  original_amount numeric(12,2) not null default 0,
  fee_amount numeric(12,2) not null default 0,
  final_usd_price numeric(12,2) not null default 0,
  exchange_rate_used numeric(14,4) not null default 0,
  rejection_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_details (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  field_values jsonb,
  reference_file_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_proofs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  file_url text not null,
  file_name text,
  mime_type text,
  file_size bigint,
  uploaded_at timestamptz not null default now()
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  button_text text,
  button_link text,
  is_enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  is_enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  base_currency text not null default 'SYP',
  target_currency text not null default 'USD',
  rate numeric(14,4) not null,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text not null,
  target_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.services enable row level security;
alter table public.service_fields enable row level security;
alter table public.payment_methods enable row level security;
alter table public.orders enable row level security;
alter table public.order_details enable row level security;
alter table public.payment_proofs enable row level security;
alter table public.banners enable row level security;
alter table public.faq_items enable row level security;
alter table public.settings enable row level security;
alter table public.exchange_rates enable row level security;
alter table public.admin_logs enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles
for select using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin" on public.profiles
for update using (id = auth.uid() or public.is_admin());

create policy "profiles_insert_self" on public.profiles
for insert with check (id = auth.uid());

create policy "categories_public_read" on public.categories
for select using (true);

create policy "categories_admin_all" on public.categories
for all using (public.is_admin()) with check (public.is_admin());

create policy "services_public_read_active" on public.services
for select using (is_active = true or public.is_admin());

create policy "services_admin_all" on public.services
for all using (public.is_admin()) with check (public.is_admin());

create policy "service_fields_public_read" on public.service_fields
for select using (
  exists (
    select 1 from public.services
    where services.id = service_fields.service_id and (services.is_active = true or public.is_admin())
  )
);

create policy "service_fields_admin_all" on public.service_fields
for all using (public.is_admin()) with check (public.is_admin());

create policy "payment_methods_public_read_enabled" on public.payment_methods
for select using (is_enabled = true or public.is_admin());

create policy "payment_methods_admin_all" on public.payment_methods
for all using (public.is_admin()) with check (public.is_admin());

create policy "orders_select_own_or_admin" on public.orders
for select using (user_id = auth.uid() or public.is_admin());

create policy "orders_insert_own" on public.orders
for insert with check (user_id = auth.uid());

create policy "orders_update_admin_only" on public.orders
for update using (public.is_admin()) with check (public.is_admin());

create policy "order_details_select_own_or_admin" on public.order_details
for select using (
  exists (
    select 1 from public.orders
    where orders.id = order_details.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

create policy "order_details_insert_own" on public.order_details
for insert with check (
  exists (
    select 1 from public.orders
    where orders.id = order_details.order_id
      and orders.user_id = auth.uid()
  )
);

create policy "order_details_update_admin" on public.order_details
for update using (public.is_admin()) with check (public.is_admin());

create policy "payment_proofs_select_own_or_admin" on public.payment_proofs
for select using (
  exists (
    select 1 from public.orders
    where orders.id = payment_proofs.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

create policy "payment_proofs_insert_own" on public.payment_proofs
for insert with check (
  exists (
    select 1 from public.orders
    where orders.id = payment_proofs.order_id
      and orders.user_id = auth.uid()
  )
);

create policy "payment_proofs_update_admin" on public.payment_proofs
for update using (public.is_admin()) with check (public.is_admin());

create policy "banners_public_read_enabled" on public.banners
for select using (is_enabled = true or public.is_admin());

create policy "banners_admin_all" on public.banners
for all using (public.is_admin()) with check (public.is_admin());

create policy "faq_public_read_enabled" on public.faq_items
for select using (is_enabled = true or public.is_admin());

create policy "faq_admin_all" on public.faq_items
for all using (public.is_admin()) with check (public.is_admin());

create policy "settings_read_all" on public.settings
for select using (true);

create policy "settings_admin_all" on public.settings
for all using (public.is_admin()) with check (public.is_admin());

create policy "exchange_rates_read_all" on public.exchange_rates
for select using (true);

create policy "exchange_rates_admin_all" on public.exchange_rates
for all using (public.is_admin()) with check (public.is_admin());

create policy "admin_logs_admin_read" on public.admin_logs
for select using (public.is_admin());

create policy "admin_logs_admin_insert" on public.admin_logs
for insert with check (public.is_admin());

insert into public.categories (id, name, slug, description, sort_order)
values
  ('11111111-1111-1111-1111-111111111111', 'خدمات الألعاب', 'games', 'شحن وخدمات الألعاب', 1),
  ('22222222-2222-2222-2222-222222222222', 'التصميم والمونتاج', 'design-media', 'تصميم ومونتاج وفيديوهات AI', 2),
  ('33333333-3333-3333-3333-333333333333', 'الخدمات الإلكترونية', 'digital-services', 'سواب واشتراكات ورصيد', 3)
on conflict (id) do nothing;

insert into public.services (id, category_id, slug, title, image_url, description, price_usd, starting_price, delivery_time_text, is_active, is_featured, is_swap_service, sort_order)
values
  ('aaaaaaa1-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'pubg-mobile-uc', 'شحن PUBG Mobile', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', 'شحن UC للعبة PUBG Mobile بسرعة عالية.', 5, 5, 'من 5 دقائق إلى 30 دقيقة', true, true, false, 1),
  ('aaaaaaa2-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'logo-design', 'تصميم شعارات', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80', 'تصميم شعار احترافي حديث.', 15, 15, 'من يوم إلى 3 أيام', true, true, false, 2),
  ('aaaaaaa3-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'swap-to-usdt', 'Swap رصيد إلى USDT', 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=1200&q=80', 'تحويل الرصيد إلى USDT مع رسوم خدمة تلقائية.', 0, 0, 'حتى 30 دقيقة', true, true, true, 3)
on conflict (id) do nothing;

insert into public.service_fields (service_id, field_key, field_label, field_type, placeholder, is_required, options, sort_order)
values
  ('aaaaaaa1-1111-1111-1111-111111111111', 'player_id', 'معرف اللاعب', 'text', 'أدخل Player ID', true, null, 1),
  ('aaaaaaa1-1111-1111-1111-111111111111', 'player_name', 'اسم اللاعب', 'text', 'الاسم داخل اللعبة', true, null, 2),
  ('aaaaaaa1-1111-1111-1111-111111111111', 'package', 'الباقة المطلوبة', 'select', null, true, '["60 UC","325 UC","660 UC","1800 UC"]'::jsonb, 3),
  ('aaaaaaa2-2222-2222-2222-222222222222', 'brand_name', 'اسم العلامة', 'text', 'اسم المشروع أو المتجر', true, null, 1),
  ('aaaaaaa2-2222-2222-2222-222222222222', 'style', 'الطابع المطلوب', 'textarea', 'صف الشكل المطلوب', true, null, 2),
  ('aaaaaaa3-3333-3333-3333-333333333333', 'source_balance_type', 'نوع الرصيد المراد تحويله', 'select', null, true, '["رصيد محلي","شام كاش سوري","شام كاش دولار"]'::jsonb, 1),
  ('aaaaaaa3-3333-3333-3333-333333333333', 'receiver_wallet', 'عنوان المحفظة المستلمة', 'text', 'أدخل عنوان USDT', true, null, 2),
  ('aaaaaaa3-3333-3333-3333-333333333333', 'transfer_amount', 'المبلغ الأصلي', 'number', 'أدخل المبلغ', true, null, 3)
on conflict do nothing;

insert into public.payment_methods (slug, title, instructions, wallet_address, requires_proof, is_hand_delivery, is_enabled)
values
  ('usdt', 'USDT', 'حوّل المبلغ إلى المحفظة التالية ثم ارفع صورة الإثبات.', 'TRC20 / BEP20 Wallet Address Here', true, false, true),
  ('ltc', 'LTC', 'أرسل المبلغ إلى عنوان LTC الموضح ثم أرفق لقطة الشاشة.', 'Litecoin Wallet Address Here', true, false, true),
  ('syriatel-cash', 'Syriatel Cash', 'أرسل الحوالة ثم ارفع صورة واضحة تحتوي رقم العملية.', null, true, false, true),
  ('mtn-cash', 'MTN Cash', 'أرسل الحوالة عبر MTN Cash ثم أرفق صورة الإثبات.', null, true, false, true),
  ('shamcash', 'شام كاش', 'حوّل المبلغ إلى عنوان شام كاش المخصص وأرفق الإثبات.', null, true, false, true),
  ('hand-delivery', 'التسليم باليد داخل مصياف - حماة', 'سيتم تحويلك إلى واتساب لتنسيق التسليم اليدوي.', null, false, true, true)
on conflict (slug) do nothing;

insert into public.banners (title, description, image_url, button_text, button_link, is_enabled, sort_order)
values
  ('منصة Mo.jrk للخدمات الرقمية', 'اطلب خدمتك الآن وارفع إثبات الدفع وتابع الحالة لحظة بلحظة.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80', 'اطلب الآن', '/services', true, 1),
  ('خدمات تحويل وسواب برسوم واضحة', 'احتساب تلقائي للرسوم ومراجعة يدوية دقيقة قبل التنفيذ.', 'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1600&q=80', 'استعرض الخدمات', '/services?category=digital-services', true, 2)
on conflict do nothing;

insert into public.faq_items (question, answer, is_enabled, sort_order)
values
  ('كيف يتم تنفيذ الطلب؟', 'تختار الخدمة، تملأ التفاصيل، تحدد وسيلة الدفع، ترفع إثبات الدفع، ثم تتم مراجعة الطلب يدويًا.', true, 1),
  ('هل الدفع أوتوماتيكي؟', 'حاليًا جميع وسائل الدفع يدوية مع إمكانية تطويرها لاحقًا إلى وسائل أوتوماتيكية.', true, 2),
  ('كيف أعرف إن تم رفض الطلب؟', 'ستظهر لك حالة الطلب داخل لوحة المستخدم مع سبب الرفض إذا قام الأدمن بتسجيله.', true, 3)
on conflict do nothing;

insert into public.settings (key, value)
values
  ('exchange_rate', '{"rate": 13500, "base_currency": "SYP", "target_currency": "USD"}'::jsonb),
  ('swap_fee_percentage', '{"percentage": 3}'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

create policy "payment_proofs_bucket_read_own_or_admin" on storage.objects
for select using (
  bucket_id = 'payment-proofs'
  and (
    public.is_admin()
    or auth.uid()::text = (storage.foldername(name))[1]
  )
);

create policy "payment_proofs_bucket_insert_own_or_admin" on storage.objects
for insert with check (
  bucket_id = 'payment-proofs'
  and (
    public.is_admin()
    or auth.uid()::text = (storage.foldername(name))[1]
  )
);

create policy "payment_proofs_bucket_update_admin" on storage.objects
for update using (
  bucket_id = 'payment-proofs'
  and public.is_admin()
)
with check (
  bucket_id = 'payment-proofs'
  and public.is_admin()
);

create policy "payment_proofs_bucket_delete_admin" on storage.objects
for delete using (
  bucket_id = 'payment-proofs'
  and public.is_admin()
);


insert into storage.buckets (id, name, public)
values ('order-reference-files', 'order-reference-files', false)
on conflict (id) do nothing;

create policy "reference_files_bucket_read_own_or_admin" on storage.objects
for select using (
  bucket_id = 'order-reference-files'
  and (
    public.is_admin()
    or auth.uid()::text = (storage.foldername(name))[1]
  )
);

create policy "reference_files_bucket_insert_own_or_admin" on storage.objects
for insert with check (
  bucket_id = 'order-reference-files'
  and (
    public.is_admin()
    or auth.uid()::text = (storage.foldername(name))[1]
  )
);

create policy "reference_files_bucket_update_admin" on storage.objects
for update using (
  bucket_id = 'order-reference-files'
  and public.is_admin()
)
with check (
  bucket_id = 'order-reference-files'
  and public.is_admin()
);

create policy "reference_files_bucket_delete_admin" on storage.objects
for delete using (
  bucket_id = 'order-reference-files'
  and public.is_admin()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists set_settings_updated_at on public.settings;
create trigger set_settings_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

create index if not exists idx_services_category_active on public.services(category_id, is_active, sort_order);
create index if not exists idx_service_fields_service_id on public.service_fields(service_id, sort_order);
create index if not exists idx_orders_user_created on public.orders(user_id, created_at desc);
create index if not exists idx_orders_status_created on public.orders(status, created_at desc);
create index if not exists idx_payment_proofs_order on public.payment_proofs(order_id);
create index if not exists idx_admin_logs_created on public.admin_logs(created_at desc);
