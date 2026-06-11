"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
};

const products: Product[] = [
  { id: 1, name: "Handmade Mug", category: "Pottery", price: 45 },
  { id: 2, name: "Wooden Bowl", category: "Woodwork", price: 60 },
  { id: 3, name: "Silver Necklace", category: "Jewelry", price: 120 },
  { id: 4, name: "Ceramic Vase", category: "Pottery", price: 80 },
  { id: 5, name: "Wood Sculpture", category: "Woodwork", price: 150 },
  { id: 6, name: "Handmade Ring", category: "Jewelry", price: 95 },
  { id: 7, name: "Decorative Plate", category: "Pottery", price: 55 },
  { id: 8, name: "Wooden Tray", category: "Woodwork", price: 70 },
  { id: 9, name: "Bracelet", category: "Jewelry", price: 40 },
  { id: 10, name: "Clay Pot", category: "Pottery", price: 35 },
];

const highestPrice = Math.max(
  ...products.map((product) => product.price)
);

const ITEMS_PER_PAGE = 6;

export default function ProductsPage() {
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(highestPrice);
  const [sort, setSort] = useState("name-asc");
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const filtered = products
      .filter(
        (product) =>
          category === "All" || product.category === category,
      )
      .filter((product) => product.price <= maxPrice);

    filtered.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;

        case "price-desc":
          return b.price - a.price;

        case "name-asc":
          return a.name.localeCompare(b.name);

        case "name-desc":
          return b.name.localeCompare(a.name);

        default:
          return 0;
      }
    });

    return filtered;
  }, [category, maxPrice, sort]);

  const totalPages = Math.ceil(
    filteredProducts.length / ITEMS_PER_PAGE,
  );

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-bold text-[#343434]">
          Product Catalog
        </h1>

        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block font-medium text-[#343434]">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-[#343434]"
            >
              <option>All</option>
              <option>Pottery</option>
              <option>Woodwork</option>
              <option>Jewelry</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#343434]">
              Maximum Price: Up to ${maxPrice}
            </label>

            <input
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
            <label className="mb-2 block font-medium text-[#343434]">
              Sort By
            </label>
             {/* alt + 26 = → 
                 alt + 27 = ← 
             */} 
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white p-2 text-[#343434]"
            >
              <option value="price-asc">
                Price: Low → High
              </option>

              <option value="price-desc">
                Price: High → Low
              </option>

              <option value="name-asc">
                Name: A → Z
              </option>

              <option value="name-desc">
                Name: Z → A
              </option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {paginatedProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.name
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex h-40 items-center justify-center rounded bg-gray-200 text-gray-600">
                Product Image
              </div>

              <h2 className="text-xl font-semibold text-[#343434]">
                {product.name}
              </h2>

              <p className="text-gray-600">
                {product.category}
              </p>

              <p className="mt-2 text-lg font-bold text-[#28582e]">
                ${product.price}
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

          <span className="flex items-center font-medium text-[#343434]">
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