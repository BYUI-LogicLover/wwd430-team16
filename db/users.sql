-- Account records. One row per signed-in person. `id` holds the GitHub account
-- id (a numeric string) — auth.ts stores it as text on first sign-in. Private
-- account fields (shipping address, editable email/name) live here; public
-- storefront data lives in `sellers`. Apply this BEFORE sellers.sql / products.sql.

-- Shared trigger function: stamps NEW."updatedAt" = now() on every UPDATE.
-- Defined here because it is reused by users, sellers, and products.
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.users (
  id                text primary key,
  name              text,
  email             text,
  image             text,
  "shippingAddress" text,
  "createdAt"       timestamp without time zone not null default now(),
  "updatedAt"       timestamp without time zone not null default now()
);

-- One account per email. The profile update in app/account/profile/actions.ts
-- catches the unique violation (SQLSTATE 23505) by this constraint name.
create unique index if not exists users_email_unique
  on public.users (email)
  where email is not null;

-- Reuse the shared trigger function that stamps NEW."updatedAt" = now().
drop trigger if exists update_users_updated_at on public.users;
create trigger update_users_updated_at
  before update on public.users
  for each row execute function public.update_updated_at_column();
