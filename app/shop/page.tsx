import ProductCatalog from "@/app/_components/ProductCatalog";
import { listAllProducts } from "@/lib/products";

export default async function ShopPage() {
  const products = await listAllProducts();

  return <ProductCatalog products={products} heading="Shop all products" />;
}
