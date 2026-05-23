export default function OrdersPage() {
  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold">Orders</h1>
        <p className="mt-2 opacity-70">Your purchase history.</p>

        <ul className="mt-8 space-y-4">
          {[1, 2].map((i) => (
            <li key={i} className="rounded-lg border border-black/10 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Order #00{i}</p>
                  <p className="text-sm opacity-70">Placed on January 1, 2026</p>
                </div>
                <span className="rounded-full bg-[#28582e] px-3 py-1 text-xs text-[#f8f8f8]">
                  Delivered
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
