"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartLink() {
  const { ready, count } = useCart();

  return (
    <Link
      href="/cart"
      className="rounded-md bg-[#28582e] px-3 py-1.5 font-medium hover:opacity-90"
    >
      Cart{ready && count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
