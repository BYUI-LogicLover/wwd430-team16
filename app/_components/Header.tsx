import Link from "next/link";
import { auth, signOut } from "@/auth";

const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/sellers", label: "Artisans" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-white/10 bg-[#343434] text-[#f8f8f8]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-[family-name:var(--font-montserrat)] text-xl font-bold tracking-wide">
          Handcrafted
        </Link>
        <nav className="hidden gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-[#28582e]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-sm">
          {session?.user ? (
            <>
              <Link href="/account" className="hover:text-[#28582e]">
                {session.user.name ?? "Account"}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="hover:text-[#28582e]">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="hover:text-[#28582e]">
              Sign in
            </Link>
          )}
          <Link
            href="/cart"
            className="rounded-md bg-[#28582e] px-3 py-1.5 font-medium hover:opacity-90"
          >
            Cart
          </Link>
        </div>
      </div>
    </header>
  );
}
