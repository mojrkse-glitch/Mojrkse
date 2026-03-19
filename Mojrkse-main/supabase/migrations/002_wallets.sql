create type public.wallet_transaction_type as enum ('topup_approved', 'order_debit', 'refund', 'admin_adjustment');
create type public.wallet_topup_status as enum ('pending', 'approved', 'rejected');

create table if not exists public.wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance_usd numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (balance_usd >= 0)
);

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.wallet_transaction_type not null,
  amount_usd numeric(12,2) not null,
  balance_after numeric(12,2) not null,
  order_id uuid references public.orders(id) on delete set null,
  topup_id uuid,
  note text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.wallet_topups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payment_method_id uuid references public.payment_methods(id) on delete set null,
  amount_usd numeric(12,2) not null,
  amount_local numeric(14,2),
  exchange_rate_used numeric(14,4) not null default 0,
  status public.wallet_topup_status not null default 'pending',
  rejection_reason text,
  notes text,
  proof_file_url text,
  proof_file_name text,
  proof_mime_type text,
  proof_file_size bigint,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (amount_usd > 0)
);

alter table public.wallets enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.wallet_topups enable row level security;

create policy "wallets_select_own_or_admin" on public.wallets
for select using (user_id = auth.uid() or public.is_admin());

create policy "wallets_insert_self_or_admin" on public.wallets
for insert with check (user_id = auth.uid() or public.is_admin());

create policy "wallets_update_admin_only" on public.wallets
for update using (public.is_admin()) with check (public.is_admin());

create policy "wallet_transactions_select_own_or_admin" on public.wallet_transactions
for select using (user_id = auth.uid() or public.is_admin());

create policy "wallet_transactions_insert_admin_only" on public.wallet_transactions
for insert with check (public.is_admin());

create policy "wallet_topups_select_own_or_admin" on public.wallet_topups
for select using (user_id = auth.uid() or public.is_admin());

create policy "wallet_topups_insert_own" on public.wallet_topups
for insert with check (user_id = auth.uid());

create policy "wallet_topups_update_admin_only" on public.wallet_topups
for update using (public.is_admin()) with check (public.is_admin());

create or replace function public.ensure_wallet_exists(target_user_id uuid)
returns public.wallets
language plpgsql
security definer
set search_path = public
as $$
declare wallet_row public.wallets;
begin
  insert into public.wallets (user_id)
  values (target_user_id)
  on conflict (user_id) do nothing;

  select * into wallet_row from public.wallets where user_id = target_user_id;
  return wallet_row;
end;
$$;

create or replace function public.create_wallet_order(
  p_service_id uuid,
  p_dynamic_values jsonb,
  p_notes text default null,
  p_reference_file_url text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_service public.services;
  v_settings_exchange numeric(14,4) := 0;
  v_swap_fee_pct numeric(8,2) := 3;
  v_wallet public.wallets;
  v_original_amount numeric(12,2) := 0;
  v_fee_amount numeric(12,2) := 0;
  v_final_price numeric(12,2) := 0;
  v_amount_input numeric(12,2) := 0;
  v_order_id uuid;
  v_balance_after numeric(12,2) := 0;
  v_field record;
  v_value text;
begin
  if v_user_id is null then
    raise exception 'يجب تسجيل الدخول أولًا.';
  end if;

  select * into v_service from public.services where id = p_service_id and is_active = true;
  if not found then
    raise exception 'الخدمة غير متاحة حاليًا.';
  end if;

  select coalesce((value->>'rate')::numeric, 0) into v_settings_exchange from public.settings where key = 'exchange_rate';
  select coalesce((value->>'percentage')::numeric, 3) into v_swap_fee_pct from public.settings where key = 'swap_fee_percentage';

  for v_field in select * from public.service_fields where service_id = p_service_id order by sort_order asc loop
    v_value := coalesce(p_dynamic_values ->> v_field.field_key, '');
    if v_field.is_required and btrim(v_value) = '' then
      raise exception 'الحقل المطلوب غير مكتمل: %', v_field.field_label;
    end if;
  end loop;

  if v_service.is_swap_service then
    v_amount_input := coalesce(nullif(p_dynamic_values->>'transfer_amount', ''), nullif(p_dynamic_values->>'amount', ''), '0')::numeric;
    if v_amount_input <= 0 then
      raise exception 'أدخل مبلغ التحويل بشكل صحيح.';
    end if;
    v_original_amount := round(v_amount_input::numeric, 2);
    v_fee_amount := round((v_original_amount * v_swap_fee_pct / 100.0)::numeric, 2);
    v_final_price := round((v_original_amount + v_fee_amount)::numeric, 2);
  else
    v_original_amount := round(coalesce(v_service.price_usd, v_service.starting_price, 0)::numeric, 2);
    if v_original_amount <= 0 then
      raise exception 'الخدمة لا تحتوي سعرًا صالحًا حاليًا.';
    end if;
    v_final_price := v_original_amount;
    v_fee_amount := 0;
  end if;

  perform public.ensure_wallet_exists(v_user_id);
  select * into v_wallet from public.wallets where user_id = v_user_id for update;

  if coalesce(v_wallet.balance_usd, 0) < v_final_price then
    raise exception 'رصيدك الحالي غير كافٍ لإتمام الطلب.';
  end if;

  insert into public.orders (
    user_id, service_id, payment_method_id, status,
    original_amount, fee_amount, final_usd_price, exchange_rate_used, notes
  ) values (
    v_user_id, p_service_id, null, 'accepted',
    v_original_amount, v_fee_amount, v_final_price, coalesce(v_settings_exchange, 0), p_notes
  ) returning id into v_order_id;

  insert into public.order_details (order_id, field_values, reference_file_url)
  values (v_order_id, coalesce(p_dynamic_values, '{}'::jsonb), p_reference_file_url);

  update public.wallets
  set balance_usd = round((balance_usd - v_final_price)::numeric, 2),
      updated_at = now()
  where user_id = v_user_id
  returning balance_usd into v_balance_after;

  insert into public.wallet_transactions (
    user_id, type, amount_usd, balance_after, order_id, note, created_by
  ) values (
    v_user_id, 'order_debit', -v_final_price, v_balance_after, v_order_id, 'خصم تلقائي مقابل طلب خدمة', v_user_id
  );

  return v_order_id;
end;
$$;

create or replace function public.approve_wallet_topup(p_topup_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_id uuid := auth.uid();
  v_topup public.wallet_topups;
  v_balance_after numeric(12,2);
begin
  if v_admin_id is null or not public.is_admin() then
    raise exception 'الوصول مخصص للإدارة فقط.';
  end if;

  select * into v_topup from public.wallet_topups where id = p_topup_id for update;
  if not found then
    raise exception 'طلب الشحن غير موجود.';
  end if;
  if v_topup.status <> 'pending' then
    raise exception 'تمت معالجة هذا الطلب مسبقًا.';
  end if;

  perform public.ensure_wallet_exists(v_topup.user_id);
  update public.wallets
  set balance_usd = round((balance_usd + v_topup.amount_usd)::numeric, 2),
      updated_at = now()
  where user_id = v_topup.user_id
  returning balance_usd into v_balance_after;

  update public.wallet_topups
  set status = 'approved', reviewed_by = v_admin_id, reviewed_at = now(), updated_at = now()
  where id = p_topup_id;

  insert into public.wallet_transactions (
    user_id, type, amount_usd, balance_after, topup_id, note, created_by
  ) values (
    v_topup.user_id, 'topup_approved', v_topup.amount_usd, v_balance_after, v_topup.id, 'شحن رصيد بعد مراجعة الإدارة', v_admin_id
  );

  return v_topup.user_id;
end;
$$;


insert into storage.buckets (id, name, public)
values ('wallet-topup-proofs', 'wallet-topup-proofs', false)
on conflict (id) do nothing;

create policy "wallet_topup_proofs_bucket_read_own_or_admin" on storage.objects
for select using (
  bucket_id = 'wallet-topup-proofs'
  and (
    public.is_admin()
    or auth.uid()::text = (storage.foldername(name))[1]
  )
);

create policy "wallet_topup_proofs_bucket_insert_own_or_admin" on storage.objects
for insert with check (
  bucket_id = 'wallet-topup-proofs'
  and (
    public.is_admin()
    or auth.uid()::text = (storage.foldername(name))[1]
  )
);

create policy "wallet_topup_proofs_bucket_update_admin" on storage.objects
for update using (
  bucket_id = 'wallet-topup-proofs'
  and public.is_admin()
)
with check (
  bucket_id = 'wallet-topup-proofs'
  and public.is_admin()
);

create policy "wallet_topup_proofs_bucket_delete_admin" on storage.objects
for delete using (
  bucket_id = 'wallet-topup-proofs'
  and public.is_admin()
);
