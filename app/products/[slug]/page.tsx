import { query } from "@/lib/db";
import ProductReviews, { Review } from "@/app/_components/ProductReviews";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  // 1. Fetch the product AND join with the seller to get the shopName
  const productRes = await query<{
    id: string;
    title: string;
    description: string;
    priceCents: number;
    category: string;
    imageUrl: string | null;
    shopName: string;
  }>(`
    SELECT p.id, p.title, p.description, p."priceCents", p.category, p."imageUrl", s."shopName"
    FROM products p
    JOIN sellers s ON p."sellerId" = s."userId"
    WHERE p.slug = $1
  `, [slug]);

  if (productRes.rows.length === 0) {
    notFound();
  }

  const product = productRes.rows[0];

  // 2. Fetch the reviews for this product
  const reviewsRes = await query<Review>(
    "SELECT * FROM reviews WHERE product_id = $1 ORDER BY created_at DESC",
    [product.id]
  );
  
  const reviews = reviewsRes.rows;

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <Link
          href="/products"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#343434] hover:bg-gray-100"
        >
          ← Back to Product Catalog
        </Link>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:grid-cols-2">
        {/* Product Image */}
        <div className="aspect-square w-full rounded-lg bg-[#e5e5e5] overflow-hidden relative">
          {product.imageUrl ? (
            <Image 
              src={product.imageUrl} 
              alt={product.title} 
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center opacity-50">
              No Image Available
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div>
          <p className="text-sm uppercase tracking-wide opacity-60">{product.category}</p>
          <h1 className="mt-1 font-[family-name:var(--font-montserrat)] text-4xl font-bold">
            {product.title}
          </h1>
          <p className="mt-2 opacity-70">By {product.shopName}</p>
          
          {/* Format priceCents to dollars */}
          <p className="mt-6 text-3xl font-semibold">
            ${(product.priceCents / 100).toFixed(2)}
          </p>
          
          <p className="mt-6 leading-relaxed opacity-80 whitespace-pre-wrap">
            {product.description || "No description provided."}
          </p>
          
          <button
            type="button"
            className="mt-8 rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
      
      {/* Reviews Component */}
      <ProductReviews productId={product.id} initialReviews={reviews} />
    </div>
  );
}