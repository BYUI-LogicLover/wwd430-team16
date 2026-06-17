import type { Metadata } from "next";
import ProductCatalog from "@/app/_components/ProductCatalog";
import { listAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Product Catalog",
  description:
    "Browse handcrafted, one-of-a-kind goods from independent artisans. Filter by category and price.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Product Catalog · Handcrafted Marketplace",
    description:
      "Browse handcrafted, one-of-a-kind goods from independent artisans.",
    url: "/products",
  },
};

type ProductsPageProps = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

export default async function ProductsPage(props: ProductsPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const products = await listAllProducts();

  return (
    <ProductCatalog
      products={products}
      initialCategory={searchParams.category ?? "All"}
    />
  );
}