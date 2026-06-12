"use server";

import { LIMITS, EMAIL_RE, validateText } from "@/lib/validation";

export type ContactState = { ok: boolean; message: string };

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const fieldError =
    validateText(name, { label: "Name", max: LIMITS.name, required: true }) ??
    validateText(email, { label: "Email", max: LIMITS.email, required: true }) ??
    validateText(message, { label: "Message", max: LIMITS.contactMessage, required: true, min: 10 });
  if (fieldError) {
    return { ok: false, message: fieldError };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  // No delivery backend is wired up yet — validation passes and we acknowledge.
  // (Hook up email/DB persistence here when available.)
  return { ok: true, message: "Thanks for reaching out — we'll get back to you soon." };
}
