"use server";

import { LIMITS, validateText, luhnValid, expiryValid } from "@/lib/validation";

export type CheckoutState = { ok: boolean; message: string };

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
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

  // No payment processor or order backend is wired up. In production, card data
  // must go to a PCI-compliant processor (e.g. Stripe) and never be handled here.
  return { ok: true, message: "Order placed! A confirmation will be sent to you." };
}
