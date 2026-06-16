import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listOrdersForUser } from "@/lib/orders";

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await listOrdersForUser(session.user.id);

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/account" className="text-sm opacity-70 hover:text-[#28582e]">
          ← Back to account
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-montserrat)] text-4xl font-bold">Orders</h1>
        <p className="mt-2 opacity-70">Your purchase history.</p>

        {orders.length === 0 ? (
          <div className="mt-10 rounded-lg border border-black/10 bg-white p-8 text-center">
            <p className="opacity-70">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/products"
              className="mt-4 inline-block rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-6">
            {orders.map((order) => (
              <li key={order.id} className="rounded-lg border border-black/10 bg-white">
                <div className="flex items-center justify-between border-b border-black/5 p-4">
                  <div>
                    <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm opacity-70">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <span className="rounded-full bg-[#28582e] px-3 py-1 text-xs capitalize text-[#f8f8f8]">
                    {order.status}
                  </span>
                </div>

                <ul className="divide-y divide-black/5">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
                      <span className="min-w-0 truncate">
                        {item.title}
                        {item.quantity > 1 ? (
                          <span className="opacity-60"> × {item.quantity}</span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-sm opacity-80">
                        {formatPrice(item.priceCents * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between border-t border-black/5 p-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{formatPrice(order.totalCents)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
