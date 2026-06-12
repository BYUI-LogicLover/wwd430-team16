-- Create the "users" table.

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
