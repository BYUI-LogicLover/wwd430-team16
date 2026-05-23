import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#343434] text-[#f8f8f8]">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-4">
        <div>
          <h3 className="font-[family-name:var(--font-montserrat)] text-lg font-semibold">
            Handcrafted
          </h3>
          <p className="mt-2 text-sm opacity-80">
            A marketplace for one-of-a-kind goods made by independent artisans.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            <li><Link href="/shop">All products</Link></li>
            <li><Link href="/shop/jewelry">Jewelry</Link></li>
            <li><Link href="/shop/home-decor">Home decor</Link></li>
            <li><Link href="/shop/art">Art</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide">Account</h4>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            <li><Link href="/account">Profile</Link></li>
            <li><Link href="/account/orders">Orders</Link></li>
            <li><Link href="/sell">Sell on Handcrafted</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide">Company</h4>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs opacity-60">
        © {new Date().getFullYear()} Handcrafted Marketplace
      </div>
    </footer>
  );
}
