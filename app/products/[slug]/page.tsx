import Link from "next/link";
import ProductReviews from "@/app/_components/ProductReviews";

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;

  const product = {
    name: slug.replace(/-/g, " "),
    price: 89.99,
    description:
      "This handcrafted item was carefully created by skilled artisans using high-quality materials. Every piece is unique and reflects the dedication, creativity, and craftsmanship of its maker.",
    seller: {
      name: "Sarah Johnson",
      bio: "Independent artisan specializing in handmade pottery and decorative pieces.",
    },
  };

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

        <div className="flex aspect-square items-center justify-center rounded-lg bg-[#e5e5e5]">
          <span className="text-lg opacity-60">
            Product Image
          </span>
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide opacity-60">
            Product
          </p>

          <h1 className="mt-1 font-[family-name:var(--font-montserrat)] text-4xl font-bold">
            {product.name}
          </h1>

          <p className="mt-2 opacity-70">
            By {product.seller.name}
          </p>

          <p className="mt-6 text-3xl font-semibold">
            ${product.price}
          </p>

          <p className="mt-6 leading-relaxed opacity-80">
            {product.description}
          </p>

          <button
            type="button"
            className="mt-8 rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90"
          >
            Add to Cart
          </button>

          <div className="mt-10 border-t pt-6">
            <h2 className="text-2xl font-semibold">
              Seller Information
            </h2>

            <p className="mt-3 font-medium">
              {product.seller.name}
            </p>

            <p className="mt-2 opacity-70">
              {product.seller.bio}
            </p>
          </div>
        </div>
      </div>

      <ProductReviews />
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