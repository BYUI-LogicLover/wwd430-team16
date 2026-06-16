-- Product reviews. Each review is written by a signed-in user about a product.
-- Shown on the product detail page (/products/[slug]) via the ProductReviews
-- component. One review per user per product — a repeat submission updates the
-- existing row (see the upsert in lib/reviews.ts).
create table if not exists public.reviews (
  id           text primary key default gen_random_uuid()::text,
  "productId"  text not null references public.products(id) on delete cascade,
  "userId"     text not null references public.users(id) on delete cascade,
  rating       integer not null check (rating between 1 and 5),
  comment      text,
  "createdAt"  timestamp without time zone not null default now(),
  "updatedAt"  timestamp without time zone not null default now(),
  unique ("productId", "userId")
);

create index if not exists reviews_product_idx on public.reviews ("productId");

-- Reuse the shared trigger function that stamps NEW."updatedAt" = now().
drop trigger if exists update_reviews_updated_at on public.reviews;
create trigger update_reviews_updated_at
  before update on public.reviews
  for each row execute function public.update_updated_at_column();
