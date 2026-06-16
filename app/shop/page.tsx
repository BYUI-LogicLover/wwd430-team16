import type { Metadata } from "next";
import ProductCatalog from "@/app/_components/ProductCatalog";
import { listAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop all products",
  description:
    "Shop every handcrafted product on the marketplace, made by independent artisans.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop all products · Handcrafted Marketplace",
    description:
      "Shop every handcrafted product on the marketplace, made by independent artisans.",
    url: "/shop",
  },
};

export default async function ShopPage() {
  const products = await listAllProducts();

  return <ProductCatalog products={products} heading="Shop all products" />;
}
