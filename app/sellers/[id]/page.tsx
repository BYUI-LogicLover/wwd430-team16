import { query } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function SellerProfilePage(props: { params: Promise<{ id: string }> }) {
  // `id` in the URL translates to the seller's custom `slug` (e.g., "alice-makes")
  const { id } = await props.params;

  // 1. Fetch seller profile details
  const sellerRes = await query<{
    userId: string;
    shopName: string;
    tagline: string | null;
    bio: string | null;
    location: string | null;
    image: string | null;
  }>(`
    SELECT s."userId", s."shopName", s.tagline, s.bio, s.location, u.image
    FROM sellers s
    JOIN users u ON s."userId" = u.id
    WHERE s.slug = $1
  `, [id]);

  if (sellerRes.rows.length === 0) {
    notFound();
  }

  const seller = sellerRes.rows[0];

  // 2. Fetch only products created by this specific seller
  const productsRes = await query<{
    id: string;
    title: string;
    slug: string;
    priceCents: number;
    imageUrl: string | null;
  }>(`
    SELECT id, title, slug, "priceCents", "imageUrl"
    FROM products
    WHERE "sellerId" = $1
    ORDER BY "createdAt" DESC
  `, [seller.userId]);

  const products = productsRes.rows;

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-black/10 pb-8">
          <div className="h-24 w-24 rounded-full bg-[#e5e5e5] relative overflow-hidden flex-shrink-0">
            {seller.image ? (
              <Image
                src={seller.image}
                alt={seller.shopName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-bold text-gray-400 text-3xl">
                {seller.shopName.charAt(0)}
              </div>
            )}
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase tracking-wider opacity-60 font-semibold">Artisan Shop</p>
            <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-bold">
              {seller.shopName}
            </h1>
            {seller.tagline && <p className="mt-1 opacity-80">{seller.tagline}</p>}
            {seller.location && <p className="mt-1 text-sm opacity-60">📍 {seller.location}</p>}
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-8 max-w-2xl">
          <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-semibold mb-2">About the Maker</h2>
          <p className="leading-relaxed opacity-80 whitespace-pre-wrap">
            {seller.bio || "This maker has not written a bio yet."}
          </p>
        </div>

        {/* Their Products Section */}
        <h2 className="mt-12 font-[family-name:var(--font-montserrat)] text-2xl font-semibold">
          Their Work
        </h2>
        
        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.length === 0 ? (
            <p className="col-span-full py-6 opacity-60">This artisan has no products listed yet.</p>
          ) : (
            products.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.slug}`}
                className="group rounded-lg border border-black/10 bg-white p-4 transition hover:border-[#28582e]"
              >
                {/* Product Image */}
                <div className="aspect-square w-full rounded-md bg-[#e5e5e5] relative overflow-hidden">
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
                
                {/* Product Metadata */}
                <h3 className="mt-4 font-semibold group-hover:text-[#28582e]">{product.title}</h3>
                <p className="mt-2 font-medium">${(product.priceCents / 100).toFixed(2)}</p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}