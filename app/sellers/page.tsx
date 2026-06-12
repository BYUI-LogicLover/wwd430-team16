import Link from "next/link";
import Image from "next/image";
import { query } from "@/lib/db";

export default async function SellersPage() {
  // Fetch all registered sellers and join with user table to get profile images
  const sellersRes = await query<{
    userId: string;
    shopName: string;
    slug: string;
    tagline: string | null;
    specialties: string[];
    image: string | null;
  }>(`
    SELECT s."userId", s."shopName", s.slug, s.tagline, s.specialties, u.image
    FROM sellers s
    JOIN users u ON s."userId" = u.id
    ORDER BY s."createdAt" DESC
  `);

  const sellers = sellersRes.rows;

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold">Artisans</h1>
        <p className="mt-2 opacity-70">Meet the makers behind every piece.</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {sellers.length === 0 ? (
            <p className="col-span-full text-center py-12 opacity-60">
              No artisans found in the database.
            </p>
          ) : (
            sellers.map((seller) => (
              <Link
                key={seller.userId}
                href={`/sellers/${seller.slug}`}
                className="rounded-lg border border-black/10 bg-white p-6 transition hover:border-[#28582e]"
              >
                {/* Profile Avatar */}
                <div className="h-20 w-20 rounded-full bg-[#e5e5e5] relative overflow-hidden">
                  {seller.image ? (
                    <Image
                      src={seller.image}
                      alt={seller.shopName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-bold text-gray-400 text-xl">
                      {seller.shopName.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="mt-4 font-semibold text-lg">{seller.shopName}</h3>
                <p className="text-sm opacity-70 italic">{seller.tagline || "Independent Maker"}</p>
                
                {/* Specialties Tags */}
                {seller.specialties && seller.specialties.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {seller.specialties.map((spec) => (
                      <span 
                        key={spec} 
                        className="rounded-full bg-[#28582e]/10 px-2 py-0.5 text-xs text-[#28582e] capitalize"
                      >
                        {spec.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}