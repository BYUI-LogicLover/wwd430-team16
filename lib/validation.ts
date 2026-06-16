// Pure module (no server-only imports) so both client form components and
// server actions share the same limits and rules.

/** Maximum character lengths for text fields across the app. */
export const LIMITS = {
  // profile
  name: 100,
  email: 254, // RFC 5321 max
  shippingAddress: 500,
  // seller shop
  shopName: 80,
  slug: 80,
  tagline: 120,
  bio: 2000,
  location: 120,
  url: 500,
  specialties: 200,
  // product listing
  productTitle: 120,
  productDescription: 2000,
  // contact
  contactMessage: 2000,
  // review
  reviewComment: 1000,
  // checkout
  street: 200,
  city: 100,
  zip: 12,
} as const;

/** Largest price we'll accept, in cents ($1,000,000). */
export const MAX_PRICE_CENTS = 100_000_000;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate a text field. Returns an error message, or null if valid.
 * Trimmed length is what's checked.
 */
export function validateText(
  value: string,
  opts: { label: string; max: number; required?: boolean; min?: number },
): string | null {
  const v = value.trim();
  if (opts.required && !v) return `${opts.label} is required.`;
  if (opts.min && v.length > 0 && v.length < opts.min) {
    return `${opts.label} must be at least ${opts.min} characters.`;
  }
  if (v.length > opts.max) return `${opts.label} must be ${opts.max} characters or fewer.`;
  return null;
}

/** Luhn checksum — validates a card number's digit string. */
export function luhnValid(digits: string): boolean {
  if (!/^\d{13,19}$/.test(digits)) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits.charCodeAt(i) - 48;
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
}

/** Validate an MM/YY expiry that is a real month and not in the past. */
export function expiryValid(value: string): boolean {
  const m = value.trim().match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  // Expires at the end of the given month.
  const expiry = new Date(year, month, 1); // first day of the following month
  return expiry > new Date();
}
