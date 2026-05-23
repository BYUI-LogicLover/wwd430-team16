import Link from "next/link";

export default function CartPage() {
  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold">
          Your cart
        </h1>

        <div className="mt-8 rounded-lg border border-black/10 bg-white">
          <div className="flex items-center gap-4 border-b border-black/5 p-4">
            <div className="h-20 w-20 rounded-md bg-[#e5e5e5]" />
            <div className="flex-1">
              <h3 className="font-semibold">Sample product</h3>
              <p className="text-sm opacity-70">Qty: 1</p>
            </div>
            <p className="font-medium">$00.00</p>
          </div>
          <div className="flex items-center justify-between p-4">
            <span className="font-semibold">Subtotal</span>
            <span className="font-semibold">$00.00</span>
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
      </div>
    </div>
  );
}
