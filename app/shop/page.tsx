import Link from "next/link";
import Image from "next/image";
import { query } from "@/lib/db";

export default async function ShopPage() {
  // Fetch all products joined with their sellers to get the shopName
  const productsRes = await query<{
    id: string;
    title: string;
    slug: string;
    priceCents: number;
    category: string;
    imageUrl: string | null;
    shopName: string;
  }>(`
    SELECT p.id, p.title, p.slug, p."priceCents", p.category, p."imageUrl", s."shopName"
    FROM products p
    JOIN sellers s ON p."sellerId" = s."userId"
    ORDER BY p."createdAt" DESC
  `);

  const products = productsRes.rows;

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold">
          Shop all products
        </h1>
        <p className="mt-2 opacity-70">Browse every handcrafted item on the marketplace.</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.length === 0 ? (
            <p className="col-span-full text-center py-12 opacity-60">
              No products found in the database.
            </p>
          ) : (
            products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group rounded-lg border border-black/10 bg-white p-4 transition hover:border-[#28582e]"
              >
                {/* Image Wrapper */}
                <div className="aspect-square w-full rounded-md bg-[#e5e5e5] overflow-hidden relative">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center opacity-50">
                      No Image
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="mt-4 font-semibold group-hover:text-[#28582e]">
                  {product.title}
                </h3>
                <p className="text-sm opacity-70">By {product.shopName}</p>
                <p className="mt-2 font-medium">
                  ${(product.priceCents / 100).toFixed(2)}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}