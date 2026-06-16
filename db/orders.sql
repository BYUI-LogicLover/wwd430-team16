-- Customer orders. An order is created at checkout for a signed-in user and is
-- shown back to them on /account/orders. Shipping details are snapshotted onto
-- the order so later profile edits don't rewrite past orders.
create table if not exists public.orders (
  id           text primary key default gen_random_uuid()::text,
  "userId"     text not null references public.users(id) on delete cascade,
  status       text not null default 'placed',
  "totalCents" integer not null check ("totalCents" >= 0),
  "fullName"   text not null,
  street       text not null,
  city         text not null,
  zip          text not null,
  "createdAt"  timestamp without time zone not null default now(),
  "updatedAt"  timestamp without time zone not null default now()
);

create index if not exists orders_user_idx on public.orders ("userId");

-- Line items for an order. Title and price are snapshotted at purchase time so
-- the order history stays accurate even if the product is later edited or
-- deleted (productId becomes null, but the snapshot remains).
create table if not exists public.order_items (
  id           text primary key default gen_random_uuid()::text,
  "orderId"    text not null references public.orders(id) on delete cascade,
  "productId"  text references public.products(id) on delete set null,
  title        text not null,
  "priceCents" integer not null check ("priceCents" >= 0),
  quantity     integer not null check (quantity > 0)
);

create index if not exists order_items_order_idx on public.order_items ("orderId");

-- Reuse the shared trigger function that stamps NEW."updatedAt" = now().
drop trigger if exists update_orders_updated_at on public.orders;
create trigger update_orders_updated_at
  before update on public.orders
  for each row execute function public.update_updated_at_column();
