import Link from "next/link";

export default function SellersPage() {
  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold">Artisans</h1>
        <p className="mt-2 opacity-70">Meet the makers behind every piece.</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {["maker-1", "maker-2", "maker-3"].map((id) => (
            <Link
              key={id}
              href={`/sellers/${id}`}
              className="rounded-lg border border-black/10 bg-white p-6 hover:border-[#28582e]"
            >
              <div className="h-20 w-20 rounded-full bg-[#e5e5e5]" />
              <h3 className="mt-4 font-semibold">Artisan {id.split("-")[1]}</h3>
              <p className="text-sm opacity-70">Handmade ceramics & textiles</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
