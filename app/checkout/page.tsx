import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold">Checkout</h1>

        <CheckoutForm />
      </div>
    </div>
  );
}
