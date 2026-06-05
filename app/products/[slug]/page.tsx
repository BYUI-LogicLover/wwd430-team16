import ProductReviews from "@/app/_components/ProductReviews";

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:grid-cols-2">
        <div className="aspect-square w-full rounded-lg bg-[#e5e5e5]" />
        <div>
          <p className="text-sm uppercase tracking-wide opacity-60">Product</p>
          <h1 className="mt-1 font-[family-name:var(--font-montserrat)] text-4xl font-bold">
            {slug.replace(/-/g, " ")}
          </h1>
          <p className="mt-2 opacity-70">By an independent artisan</p>
          <p className="mt-6 text-3xl font-semibold">$00.00</p>
          <p className="mt-6 leading-relaxed opacity-80">
            Product description goes here. Tell the story of the piece — materials, craft, the
            maker behind it.
          </p>
          <button
            type="button"
            className="mt-8 rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90"
          >
            Add to cart
          </button>
        </div>
      </div>
      <ProductReviews />
    </div>
  );
}
