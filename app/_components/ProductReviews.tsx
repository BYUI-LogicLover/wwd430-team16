import Link from "next/link";
import { auth } from "@/auth";
import { listReviewsForProduct, getReviewSummary } from "@/lib/reviews";
import ReviewForm from "./ReviewForm";

export default async function ProductReviews({
  productId,
  slug,
}: {
  productId: string;
  slug: string;
}) {
  const session = await auth();
  const [reviews, summary] = await Promise.all([
    listReviewsForProduct(productId),
    getReviewSummary(productId),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="border-t pt-10">
        <h2 className="text-2xl font-bold">Reviews & Ratings</h2>

        <div className="mt-4">
          <span className="text-3xl font-bold">
            {summary.count > 0 ? summary.average.toFixed(1) : "—"}
          </span>
          <span className="ml-2 text-gray-500">
            / 5 ({summary.count} {summary.count === 1 ? "review" : "reviews"})
          </span>
        </div>

        <div className="mt-8 space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet. Be the first!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="rounded-lg border bg-white p-4">
                <div className="font-semibold">{review.author ?? "Anonymous"}</div>

                <div className="text-yellow-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>

                {review.comment ? (
                  <p className="mt-2 text-sm">{review.comment}</p>
                ) : null}
              </div>
            ))
          )}
        </div>

        {session?.user?.id ? (
          <ReviewForm productId={productId} slug={slug} />
        ) : (
          <p className="mt-10 text-sm text-gray-600">
            <Link href="/login" className="font-medium text-[#28582e] hover:underline">
              Sign in
            </Link>{" "}
            to leave a review.
          </p>
        )}
      </div>
    </section>
  );
}
