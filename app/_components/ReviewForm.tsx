"use client";

import { useActionState, useEffect, useRef } from "react";
import { LIMITS } from "@/lib/validation";
import { submitReview, type ReviewState } from "./reviewActions";

const initialState: ReviewState = { ok: false, message: "" };

export default function ReviewForm({
  productId,
  slug,
}: {
  productId: string;
  slug: string;
}) {
  const [state, formAction, pending] = useActionState(submitReview, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the form once a review is saved; the server re-renders the list.
  // The inputs are uncontrolled, so a native reset() restores their defaults.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="mt-10">
      <h3 className="mb-4 text-xl font-semibold">Leave a Review</h3>

      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="slug" value={slug} />

      <label className="block">
        Rating
        <select
          name="rating"
          defaultValue={5}
          className="mt-1 w-full rounded border p-2"
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
          name="comment"
          rows={4}
          maxLength={LIMITS.reviewComment}
          className="mt-1 w-full rounded border p-2"
          required
        />
      </label>

      {state.message ? (
        <p
          role="status"
          className={`mt-3 text-sm ${state.ok ? "text-[#28582e]" : "text-red-600"}`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded bg-[#28582e] px-5 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
