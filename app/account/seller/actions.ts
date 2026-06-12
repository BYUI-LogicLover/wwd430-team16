"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { upsertSeller, slugify } from "@/lib/sellers";
import { LIMITS, validateText } from "@/lib/validation";

export type SellerState = {
  ok: boolean;
  message: string;
  /** Set on a successful save so the UI can link to the live shop. */
  slug?: string;
};

function parseSpecialties(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveSeller(
  _prevState: SellerState,
  formData: FormData,
): Promise<SellerState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "You must be signed in to manage your shop." };
  }

  const shopName = String(formData.get("shopName") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || shopName);
  const tagline = String(formData.get("tagline") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const specialtiesRaw = String(formData.get("specialties") ?? "").trim();
  const websiteUrl = String(formData.get("websiteUrl") ?? "").trim();
  const instagramUrl = String(formData.get("instagramUrl") ?? "").trim();

  const fieldError =
    validateText(shopName, { label: "Shop name", max: LIMITS.shopName, required: true }) ??
    validateText(tagline, { label: "Tagline", max: LIMITS.tagline }) ??
    validateText(bio, { label: "About your shop", max: LIMITS.bio }) ??
    validateText(location, { label: "Location", max: LIMITS.location }) ??
    validateText(specialtiesRaw, { label: "Specialties", max: LIMITS.specialties }) ??
    validateText(websiteUrl, { label: "Website", max: LIMITS.url }) ??
    validateText(instagramUrl, { label: "Instagram", max: LIMITS.url });
  if (fieldError) {
    return { ok: false, message: fieldError };
  }
  if (!slug || slug.length > LIMITS.slug) {
    return { ok: false, message: "Please provide a valid shop URL (letters and numbers)." };
  }

  try {
    await upsertSeller(session.user.id, {
      shopName,
      slug,
      tagline: tagline || null,
      bio: bio || null,
      location: location || null,
      specialties: parseSpecialties(specialtiesRaw),
      websiteUrl: websiteUrl || null,
      instagramUrl: instagramUrl || null,
    });
  } catch (err) {
    // sellers.slug is unique — another shop already uses this URL.
    if (err && typeof err === "object" && "code" in err && err.code === "23505") {
      return { ok: false, message: `The shop URL "${slug}" is already taken. Try another.` };
    }
    throw err;
  }

  revalidatePath("/account/seller");
  revalidatePath("/sellers");
  revalidatePath(`/sellers/${slug}`);
  return { ok: true, message: "Shop profile saved.", slug };
}
