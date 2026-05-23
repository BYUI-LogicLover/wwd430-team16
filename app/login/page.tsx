import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-bold">Sign in</h1>
        <p className="mt-2 opacity-70">Welcome back.</p>

        <form className="mt-8 grid gap-4">
          <input type="email" placeholder="Email" className="rounded-md border border-black/10 px-3 py-2" />
          <input type="password" placeholder="Password" className="rounded-md border border-black/10 px-3 py-2" />
          <button
            type="submit"
            className="rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-sm opacity-70">
          New here?{" "}
          <Link href="/register" className="font-medium text-[#28582e]">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
