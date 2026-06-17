import Link from "next/link";
import { listCategoriesWithListings } from "@/lib/products";

export default async function Home() {
  const categories = await listCategoriesWithListings();

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="font-[family-name:var(--font-montserrat)] text-5xl font-bold leading-tight md:text-6xl">
          Discover handcrafted goods,<br />made by real artisans.
        </h1>
        <p className="mt-6 max-w-xl text-lg opacity-80">
          Shop one-of-a-kind pieces directly from independent makers around the world.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/shop"
            className="rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90"
          >
            Browse the shop
          </Link>
          <Link
            href="/sell"
            className="rounded-md border border-[#343434] px-6 py-3 font-medium hover:bg-[#343434] hover:text-[#f8f8f8]"
          >
            Sell your work
          </Link>
        </div>
      </section>

      {categories.length > 0 ? (
        <section className="border-t border-black/5 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-semibold">
              Shop by category
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  className="rounded-lg border border-black/10 bg-[#f8f8f8] p-6 transition hover:border-[#28582e]"
                >
                  <span className="font-medium">{c.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
