import { notFound } from "next/navigation";
import ProductCatalog from "@/app/_components/ProductCatalog";
import { categoryLabel, isValidCategory, listProductsByCategory } from "@/lib/products";

export default async function CategoryPage(props: PageProps<"/shop/[category]">) {
  const { category } = await props.params;

  if (!isValidCategory(category)) {
    notFound();
  }

  const products = await listProductsByCategory(category);

  return <ProductCatalog products={products} heading={categoryLabel(category)} />;
}
