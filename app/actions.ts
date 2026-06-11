// app/actions.ts
"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addReview(productId: string, rating: number, comment: string) {
  if (!comment || rating < 1 || rating > 5) return;

  await query(
    "INSERT INTO reviews (product_id, author, rating, comment) VALUES ($1, $2, $3, $4)",
    [productId, "Anonymous User", rating, comment]
  );

  // Clear the cache for the product page so the new review shows up instantly
  revalidatePath("/products/[slug]", "page");
}