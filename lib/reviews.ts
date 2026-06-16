import { query } from "@/lib/db";

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  /** Display name pulled from the linked user row; null users fall back later. */
  author: string | null;
  createdAt: Date;
};

/** Average rating + count for a product, computed in the database. */
export type ReviewSummary = {
  average: number;
  count: number;
};

const SELECT_FIELDS = `
  r.id, r.rating, r.comment, r."createdAt", u.name as author
`;

/** All reviews for a product, newest first, joined with the author's user row. */
export async function listReviewsForProduct(productId: string): Promise<Review[]> {
  const result = await query<Review>(
    `select ${SELECT_FIELDS}
       from public.reviews r
       join public.users u on u.id = r."userId"
      where r."productId" = $1
      order by r."createdAt" desc`,
    [productId],
  );
  return result.rows;
}

/** Average rating (rounded to 1 decimal) and review count for a product. */
export async function getReviewSummary(productId: string): Promise<ReviewSummary> {
  const result = await query<{ average: string | null; count: string }>(
    `select avg(rating) as average, count(*) as count
       from public.reviews where "productId" = $1`,
    [productId],
  );
  const row = result.rows[0];
  return {
    average: row?.average ? Math.round(Number(row.average) * 10) / 10 : 0,
    count: Number(row?.count ?? 0),
  };
}

/**
 * Create or update the signed-in user's review for a product. One review per
 * user per product — submitting again overwrites the previous rating/comment.
 */
export async function upsertReview(
  productId: string,
  userId: string,
  rating: number,
  comment: string | null,
): Promise<void> {
  await query(
    `insert into public.reviews ("productId", "userId", rating, comment)
     values ($1, $2, $3, $4)
     on conflict ("productId", "userId") do update set
       rating  = excluded.rating,
       comment = excluded.comment`,
    [productId, userId, rating, comment],
  );
}
