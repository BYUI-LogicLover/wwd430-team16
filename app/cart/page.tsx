"use client";

import Link from "next/link";
import { useCart } from "@/app/_components/CartProvider";

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default function CartPage() {
  const { ready, items, subtotalCents, updateQuantity, removeItem } = useCart();

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold">Your cart</h1>

        {!ready ? (
          <p className="mt-8 opacity-70">Loading…</p>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-lg border border-black/10 bg-white p-8 text-center">
            <p className="opacity-70">Your cart is empty.</p>
            <Link
              href="/products"
              className="mt-4 inline-block rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 rounded-lg border border-black/10 bg-white">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 border-b border-black/5 p-4 last:border-b-0"
                >
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt="" className="h-20 w-20 rounded-md object-cover" />
                  ) : (
                    <div className="h-20 w-20 rounded-md bg-[#e5e5e5]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${item.slug}`} className="font-semibold hover:text-[#28582e]">
                      {item.title}
                    </Link>
                    <div className="mt-2 flex items-center gap-3">
                      <label className="text-sm opacity-70">
                        Qty
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.productId, Math.max(1, Number(e.target.value)))
                          }
                          className="ml-2 w-16 rounded border border-black/10 px-2 py-1"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-medium">{formatPrice(item.priceCents * item.quantity)}</p>
                </div>
              ))}
              <div className="flex items-center justify-between p-4">
                <span className="font-semibold">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotalCents)}</span>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                href="/checkout"
                className="rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
