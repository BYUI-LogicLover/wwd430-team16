import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductReviews from "@/app/_components/ProductReviews";
import AddToCartButton from "@/app/_components/AddToCartButton";
import { getProductBySlug, categoryLabel } from "@/lib/products";

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  const description =
    product.description?.slice(0, 200) ??
    `${product.title} by ${product.shopName} on Handcrafted Marketplace.`;
  const canonical = `/products/${product.slug}`;

  return {
    title: product.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: product.title,
      description,
      url: canonical,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: product.imageUrl ? [product.imageUrl] : undefined,
    },
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.imageUrl ?? undefined,
    description: product.description ?? undefined,
    category: categoryLabel(product.category),
    brand: { "@type": "Brand", name: product.shopName },
    offers: {
      "@type": "Offer",
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <Link
          href="/products"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#343434] hover:bg-gray-100"
        >
          ← Back to Product Catalog
        </Link>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:grid-cols-2">
        {product.imageUrl ? (
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 576px"
              className="object-cover"
              // Main product image is the LCP element on this page.
              preload
            />
          </div>
        ) : (
          <div className="flex aspect-square items-center justify-center rounded-lg bg-[#e5e5e5]">
            <span className="opacity-60">Product Image</span>
          </div>
        )}

        <div>
          <p className="text-sm uppercase tracking-wide opacity-60">
            {categoryLabel(product.category)}
          </p>

          <h1 className="mt-1 text-4xl font-bold">
            {product.title}
          </h1>

          <p className="mt-2 opacity-70">
            By{" "}
            <Link
              href={`/sellers/${product.sellerSlug}`}
              className="font-medium text-[#28582e] hover:underline"
            >
              {product.shopName}
            </Link>
          </p>

          <p className="mt-6 text-3xl font-semibold">
            {formatPrice(product.priceCents)}
          </p>

          {product.description ? (
            <p className="mt-6 whitespace-pre-line leading-relaxed opacity-80">
              {product.description}
            </p>
          ) : null}

          <AddToCartButton
            product={{
              productId: product.id,
              slug: product.slug,
              title: product.title,
              priceCents: product.priceCents,
              imageUrl: product.imageUrl,
            }}
          />
        </div>
      </div>

      <ProductReviews productId={product.id} slug={slug} />

      <div className="mx-auto max-w-6xl px-6 pb-12">
        <div className="mt-8 flex justify-center">
          <Link
            href="/products"
            className="rounded-md bg-[#28582e] px-6 py-3 font-medium text-white hover:opacity-90"
          >
            Back to Product Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}