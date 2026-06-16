"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createOrder, type CartLine } from "@/lib/orders";
import { LIMITS, validateText, luhnValid, expiryValid } from "@/lib/validation";

export type CheckoutState = { ok: boolean; message: string; orderId?: string };

function parseLines(raw: string): CartLine[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((l) => ({ productId: String(l.productId ?? ""), quantity: Number(l.quantity) }))
      .filter((l) => l.productId && Number.isInteger(l.quantity) && l.quantity > 0);
  } catch {
    return [];
  }
}

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "Please sign in to place an order." };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const street = String(formData.get("street") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const zip = String(formData.get("zip") ?? "").trim();
  const cardRaw = String(formData.get("cardNumber") ?? "");
  const card = cardRaw.replace(/[\s-]/g, "");
  const expiry = String(formData.get("expiry") ?? "").trim();
  const cvc = String(formData.get("cvc") ?? "").trim();

  const fieldError =
    validateText(fullName, { label: "Full name", max: LIMITS.name, required: true }) ??
    validateText(street, { label: "Street address", max: LIMITS.street, required: true }) ??
    validateText(city, { label: "City", max: LIMITS.city, required: true });
  if (fieldError) {
    return { ok: false, message: fieldError };
  }

  if (!/^[A-Za-z0-9][A-Za-z0-9 -]{2,11}$/.test(zip)) {
    return { ok: false, message: "Enter a valid ZIP / postal code." };
  }
  if (!luhnValid(card)) {
    return { ok: false, message: "Enter a valid card number." };
  }
  if (!expiryValid(expiry)) {
    return { ok: false, message: "Enter a valid, unexpired expiry date (MM/YY)." };
  }
  if (!/^\d{3,4}$/.test(cvc)) {
    return { ok: false, message: "Enter a valid CVC (3 or 4 digits)." };
  }

  const lines = parseLines(String(formData.get("items") ?? ""));
  if (lines.length === 0) {
    return { ok: false, message: "Your cart is empty." };
  }

  // Card data is intentionally not stored. In production it must go to a
  // PCI-compliant processor (e.g. Stripe) and never be handled here. We persist
  // only the order and its items; prices are re-read from the DB in createOrder.
  const orderId = await createOrder(
    session.user.id,
    { fullName, street, city, zip },
    lines,
  );
  if (!orderId) {
    return { ok: false, message: "We couldn't find those items. Please review your cart." };
  }

  revalidatePath("/account/orders");
  return { ok: true, message: "Order placed! A confirmation will be sent to you.", orderId };
}
