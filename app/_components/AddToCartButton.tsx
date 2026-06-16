"use client";

import { useState } from "react";
import { useCart, type CartItem } from "./CartProvider";

export default function AddToCartButton({ product }: { product: Omit<CartItem, "quantity"> }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-8 rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90"
    >
      {added ? "Added to cart ✓" : "Add to Cart"}
    </button>
  );
}
