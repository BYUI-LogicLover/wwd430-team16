"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Product = {
  id: string;
  title: string;
  slug: string;
  category: string;
  priceCents: number;
  imageUrl: string | null;
  shopName: string;
};

type ProductCatalogProps = {
  products: Product[];
  heading?: string;
};

const ITEMS_PER_PAGE = 6;

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function ProductCatalog({
  products,
  heading = "Product Catalog",
}: ProductCatalogProps) {
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const highestPrice =
    products.length > 0 ? Math.max(...products.map((product) => product.priceCents)) : 0;

  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(highestPrice);
  const [sort, setSort] = useState("name-asc");
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const filtered = products
      .filter((product) => category === "All" || product.category === category)
      .filter((product) => product.priceCents <= maxPrice);

    filtered.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.priceCents - b.priceCents;
        case "price-desc":
          return b.priceCents - a.priceCents;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [category, maxPrice, sort, products]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: heading,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.title,
      url: `/products/${product.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#343434]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-bold">{heading}</h1>

        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="catalog-category" className="mb-2 block font-medium">
              Category
            </label>

            <select
              id="catalog-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-[#343434]"
            >
              {categories.map((categoryOption) => (
                <option key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="catalog-max-price" className="mb-2 block font-medium">
              Maximum Price: Up to {formatPrice(maxPrice)}
            </label>

            <input
              id="catalog-max-price"
              type="range"
              min="0"
              max={highestPrice}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setPage(1);
              }}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="catalog-sort" className="mb-2 block font-medium">
              Sort By
            </label>

            <select
              id="catalog-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-[#343434]"
            >
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
              <option value="name-desc">Name: Z → A</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {paginatedProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {product.imageUrl ? (
                <div className="relative mb-4 h-40 w-full overflow-hidden rounded">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="object-cover"
                    // Eager-load the first card (likely LCP); lazy-load the rest.
                    preload={index === 0}
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-40 items-center justify-center rounded bg-gray-200 text-gray-600">
                  Product Image
                </div>
              )}

              <h2 className="text-xl font-semibold text-[#343434]">
                {product.title}
              </h2>

              <p className="text-gray-600">{product.category}</p>

              <p className="mt-1 text-sm text-gray-500">
                By {product.shopName}
              </p>

              <p className="mt-2 text-lg font-bold text-[#28582e]">
                {formatPrice(product.priceCents)}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-[#343434] hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="flex items-center font-medium">
            Page {page} of {totalPages || 1}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-[#343434] hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}