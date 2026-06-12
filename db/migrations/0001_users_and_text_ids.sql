-- Idempotent migration: add the `users` table + the shared updatedAt trigger
-- function, and convert sellers."userId" / products."sellerId" from integer to
-- text so they match the GitHub account id (text) that auth.ts stores.
--
-- Safe to run repeatedly and against ANY prior state:
--   * fresh DB                         -> creates everything
--   * partially applied (integer ids)  -> retypes columns in place
--   * already migrated (text ids)      -> all steps are no-ops
--
-- Run against the NON-pooling connection (POSTGRES_URL_NON_POOLING).

begin;

-- 1. Shared trigger function. `create or replace` is inherently idempotent.
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$ language plpgsql;

-- 2. users table (the missing piece that broke GitHub login).
create table if not exists public.users (
  id                text primary key,
  name              text,
  email             text,
  image             text,
  "shippingAddress" text,
  "createdAt"       timestamp without time zone not null default now(),
  "updatedAt"       timestamp without time zone not null default now()
);

create unique index if not exists users_email_unique
  on public.users (email)
  where email is not null;

drop trigger if exists update_users_updated_at on public.users;
create trigger update_users_updated_at
  before update on public.users
  for each row execute function public.update_updated_at_column();

-- 3. Drop every FK on sellers/products before retyping their id columns.
--    Constraint names are auto-generated, so discover and drop them dynamically.
do $$
declare
  c record;
begin
  for c in
    select rel.relname as tbl, con.conname as name
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where con.contype = 'f'
      and nsp.nspname = 'public'
      and rel.relname in ('sellers', 'products')
  loop
    execute format('alter table public.%I drop constraint %I', c.tbl, c.name);
  end loop;
end $$;

-- 4. Retype the id columns integer -> text. Guarded so it is a no-op when the
--    column is already text (or the table does not exist yet).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'sellers'
      and column_name = 'userId' and data_type <> 'text'
  ) then
    alter table public.sellers alter column "userId" type text using "userId"::text;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products'
      and column_name = 'sellerId' and data_type <> 'text'
  ) then
    alter table public.products alter column "sellerId" type text using "sellerId"::text;
  end if;
end $$;

-- 5. Create sellers/products on a fresh DB. No-ops if they already exist (the
--    existing-table path relies on the FK re-add in step 6 instead).
create table if not exists public.sellers (
    "userId"       text primary key references public.users (id) on delete cascade,
    "shopName"     text not null,
    slug           text not null unique,
    tagline        text,
    bio            text,
    location       text,
    specialties    text[] not null default '{}',
    "websiteUrl"   text,
    "instagramUrl" text,
    "createdAt"    timestamp without time zone not null default now(),
    "updatedAt"    timestamp without time zone not null default now()
);

create table if not exists public.products (
  id            text primary key default gen_random_uuid()::text,
  "sellerId"    text not null references public.sellers("userId") on delete cascade,
  title         text not null,
  slug          text not null unique,
  description   text,
  "priceCents"  integer not null default 0 check ("priceCents" >= 0),
  category      text not null default 'other',
  "imageUrl"    text,
  "imagePath"   text,
  "createdAt"   timestamp without time zone not null default now(),
  "updatedAt"   timestamp without time zone not null default now()
);

-- 6. Re-add the FKs that were dropped in step 3. Postgres auto-names inline FKs
--    `<table>_<column>_fkey`, so on the fresh path (step 5 created them inline)
--    these checks find them and skip; on the existing-table path they add them.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'sellers_userId_fkey') then
    alter table public.sellers
      add constraint "sellers_userId_fkey"
      foreign key ("userId") references public.users (id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'products_sellerId_fkey') then
    alter table public.products
      add constraint "products_sellerId_fkey"
      foreign key ("sellerId") references public.sellers ("userId") on delete cascade;
  end if;
end $$;

-- 7. Indexes + triggers for sellers/products (all idempotent).
create index if not exists products_seller_idx on public.products ("sellerId");
create index if not exists products_category_idx on public.products (category);

drop trigger if exists update_sellers_updated_at on public.sellers;
create trigger update_sellers_updated_at
  before update on public.sellers
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_products_updated_at on public.products;
create trigger update_products_updated_at
  before update on public.products
  for each row execute function public.update_updated_at_column();

commit;
