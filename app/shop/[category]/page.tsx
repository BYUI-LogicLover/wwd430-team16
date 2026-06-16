import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCatalog from "@/app/_components/ProductCatalog";
import { categoryLabel, isValidCategory, listProductsByCategory } from "@/lib/products";

export async function generateMetadata(
  props: PageProps<"/shop/[category]">,
): Promise<Metadata> {
  const { category } = await props.params;

  if (!isValidCategory(category)) {
    return { title: "Category not found" };
  }

  const label = categoryLabel(category);
  const description = `Shop handcrafted ${label} from independent artisans on Handcrafted Marketplace.`;

  return {
    title: label,
    description,
    alternates: { canonical: `/shop/${category}` },
    openGraph: {
      title: `${label} · Handcrafted Marketplace`,
      description,
      url: `/shop/${category}`,
    },
  };
}

export default async function CategoryPage(props: PageProps<"/shop/[category]">) {
  const { category } = await props.params;

  if (!isValidCategory(category)) {
    notFound();
  }

  const products = await listProductsByCategory(category);

  return <ProductCatalog products={products} heading={categoryLabel(category)} />;
}
