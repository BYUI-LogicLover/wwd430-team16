"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LIMITS } from "@/lib/validation";
import { useCart } from "@/app/_components/CartProvider";
import { placeOrder, type CheckoutState } from "./actions";

const initialState: CheckoutState = { ok: false, message: "" };
const inputClass = "rounded-md border border-black/10 px-3 py-2";

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default function CheckoutForm() {
  const router = useRouter();
  const { ready, items, subtotalCents, clear } = useCart();
  const [state, formAction, pending] = useActionState(placeOrder, initialState);

  // On a successful order, empty the cart and send the buyer to their orders.
  useEffect(() => {
    if (state.ok && state.orderId) {
      clear();
      router.push("/account/orders");
    }
  }, [state.ok, state.orderId, clear, router]);

  if (ready && items.length === 0 && !state.ok) {
    return (
      <div className="mt-8 rounded-lg border border-black/10 bg-white p-8 text-center">
        <p className="opacity-70">Your cart is empty.</p>
        <Link
          href="/products"
          className="mt-4 inline-block rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90"
        >
          Browse products
        </Link>
      </div>
    );
  }

  const itemsPayload = JSON.stringify(
    items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
  );

  return (
    <form action={formAction} className="mt-8 grid gap-8 md:grid-cols-2">
      <input type="hidden" name="items" value={itemsPayload} />
      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-semibold">
          Shipping address
        </h2>
        <div className="mt-4 grid gap-4">
          <input name="fullName" type="text" placeholder="Full name" required maxLength={LIMITS.name} className={inputClass} />
          <input name="street" type="text" placeholder="Street address" required maxLength={LIMITS.street} className={inputClass} />
          <input name="city" type="text" placeholder="City" required maxLength={LIMITS.city} className={inputClass} />
          <input
            name="zip"
            type="text"
            placeholder="ZIP / Postal code"
            required
            maxLength={LIMITS.zip}
            inputMode="numeric"
            className={inputClass}
          />
        </div>
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-semibold">Payment</h2>
        <div className="mt-4 grid gap-4">
          <input
            name="cardNumber"
            type="text"
            placeholder="Card number"
            required
            inputMode="numeric"
            autoComplete="cc-number"
            maxLength={23}
            className={inputClass}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              name="expiry"
              type="text"
              placeholder="MM/YY"
              required
              autoComplete="cc-exp"
              maxLength={5}
              className={inputClass}
            />
            <input
              name="cvc"
              type="text"
              placeholder="CVC"
              required
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={4}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <div className="md:col-span-2 flex items-center justify-between border-t border-black/10 pt-4">
        <span className="font-semibold">Total</span>
        <span className="text-lg font-semibold">{formatPrice(subtotalCents)}</span>
      </div>

      {state.message ? (
        <p
          role="status"
          className={`md:col-span-2 text-sm ${state.ok ? "text-[#28582e]" : "text-red-600"}`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || !ready || items.length === 0}
        className="md:col-span-2 rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}
