"use client";

import { useMemo, useState } from "react";
import { addReview } from "@/app/actions";

export type Review = {
  id: string;
  product_id: string;
  author: string;
  rating: number;
  comment: string;
  created_at: Date;
};

export default function ProductReviews({ 
  productId, 
  initialReviews 
}: { 
  productId: string; 
  initialReviews: Review[] 
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const averageRating = useMemo(() => {
    if (initialReviews.length === 0) return "0.0";
    return (
      initialReviews.reduce((acc, review) => acc + review.rating, 0) /
      initialReviews.length
    ).toFixed(1);
  }, [initialReviews]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    await addReview(productId, rating, comment);
    
    setComment("");
    setRating(5);
    setIsSubmitting(false);
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="border-t pt-10">
        <h2 className="text-2xl font-bold">Reviews & Ratings</h2>

        <div className="mt-4">
          <span className="text-3xl font-bold">{averageRating}</span>
          <span className="ml-2 text-gray-500">
            / 5 ({initialReviews.length} reviews)
          </span>
        </div>

        <div className="mt-8 space-y-4">
          {initialReviews.length === 0 && (
            <p className="text-sm opacity-70">No reviews yet. Be the first!</p>
          )}
          {initialReviews.map((review) => (
            <div key={review.id} className="rounded-lg border bg-white p-4">
              <div className="font-semibold">{review.author}</div>
              <div className="text-yellow-500">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
              <p className="mt-2 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-10">
          <h3 className="mb-4 text-xl font-semibold">Leave a Review</h3>

          <label className="block">
            Rating
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 w-full rounded border p-2"
              disabled={isSubmitting}
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </label>

          <label className="mt-4 block">
            Comment
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded border p-2"
              required
              disabled={isSubmitting}
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 rounded bg-[#28582e] px-5 py-2 text-white disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </section>
  );
}