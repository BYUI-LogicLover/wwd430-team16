"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { upsertReview } from "@/lib/reviews";
import { LIMITS, validateText } from "@/lib/validation";

export type ReviewState = { ok: boolean; message: string };

export async function submitReview(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "Please sign in to leave a review." };
  }

  const productId = String(formData.get("productId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!productId) {
    return { ok: false, message: "Missing product." };
  }

  const rating = Number(formData.get("rating"));
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, message: "Pick a rating between 1 and 5 stars." };
  }

  const comment = String(formData.get("comment") ?? "").trim();
  const commentError = validateText(comment, {
    label: "Comment",
    max: LIMITS.reviewComment,
    required: true,
  });
  if (commentError) return { ok: false, message: commentError };

  await upsertReview(productId, session.user.id, rating, comment);

  if (slug) revalidatePath(`/products/${slug}`);

  return { ok: true, message: "Thanks for your review!" };
}
