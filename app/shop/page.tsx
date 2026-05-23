import Link from "next/link";

export default function ShopPage() {
  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold">
          Shop all products
        </h1>
        <p className="mt-2 opacity-70">Browse every handcrafted item on the marketplace.</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Link
              key={i}
              href={`/products/sample-${i}`}
              className="group rounded-lg border border-black/10 bg-white p-4 transition hover:border-[#28582e]"
            >
              <div className="aspect-square w-full rounded-md bg-[#e5e5e5]" />
              <h3 className="mt-4 font-semibold group-hover:text-[#28582e]">Sample product {i}</h3>
              <p className="text-sm opacity-70">By an artisan</p>
              <p className="mt-2 font-medium">$00.00</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
