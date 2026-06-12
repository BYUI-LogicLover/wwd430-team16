import ProductCatalog from "@/app/_components/ProductCatalog";
import { listAllProducts } from "@/lib/products";

export default async function ProductsPage() {
  const products = await listAllProducts();

  return <ProductCatalog products={products} />;
}