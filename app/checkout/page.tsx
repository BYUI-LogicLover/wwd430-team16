export default function CheckoutPage() {
  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold">Checkout</h1>

        <form className="mt-8 grid gap-8 md:grid-cols-2">
          <section className="rounded-lg border border-black/10 bg-white p-6">
            <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-semibold">
              Shipping address
            </h2>
            <div className="mt-4 grid gap-4">
              <input type="text" placeholder="Full name" className="rounded-md border border-black/10 px-3 py-2" />
              <input type="text" placeholder="Street address" className="rounded-md border border-black/10 px-3 py-2" />
              <input type="text" placeholder="City" className="rounded-md border border-black/10 px-3 py-2" />
              <input type="text" placeholder="ZIP / Postal code" className="rounded-md border border-black/10 px-3 py-2" />
            </div>
          </section>

          <section className="rounded-lg border border-black/10 bg-white p-6">
            <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-semibold">Payment</h2>
            <div className="mt-4 grid gap-4">
              <input type="text" placeholder="Card number" className="rounded-md border border-black/10 px-3 py-2" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="MM/YY" className="rounded-md border border-black/10 px-3 py-2" />
                <input type="text" placeholder="CVC" className="rounded-md border border-black/10 px-3 py-2" />
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="md:col-span-2 rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90"
          >
            Place order
          </button>
        </form>
      </div>
    </div>
  );
}
