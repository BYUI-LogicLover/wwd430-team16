export default async function CategoryPage(props: PageProps<"/shop/[category]">) {
  const { category } = await props.params;
  const label = category.replace(/-/g, " ");

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm uppercase tracking-wide opacity-60">Category</p>
        <h1 className="mt-1 font-[family-name:var(--font-montserrat)] text-4xl font-bold capitalize">
          {label}
        </h1>
        <p className="mt-2 opacity-70">Handcrafted {label} from independent makers.</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-black/10 bg-white p-4">
              <div className="aspect-square w-full rounded-md bg-[#e5e5e5]" />
              <h3 className="mt-4 font-semibold">Sample {label} {i}</h3>
              <p className="mt-2 font-medium">$00.00</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
