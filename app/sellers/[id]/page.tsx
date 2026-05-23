export default async function SellerProfilePage(props: PageProps<"/sellers/[id]">) {
  const { id } = await props.params;

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-[#e5e5e5]" />
          <div>
            <p className="text-sm uppercase tracking-wide opacity-60">Artisan</p>
            <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-bold">
              {id.replace(/-/g, " ")}
            </h1>
          </div>
        </div>

        <p className="mt-8 max-w-2xl leading-relaxed opacity-80">
          A short bio about the maker — their craft, their materials, and the story behind their
          work.
        </p>

        <h2 className="mt-12 font-[family-name:var(--font-montserrat)] text-2xl font-semibold">
          Their work
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-black/10 bg-white p-4">
              <div className="aspect-square w-full rounded-md bg-[#e5e5e5]" />
              <p className="mt-4 font-semibold">Product {i}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
