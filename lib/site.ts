/**
 * The site's canonical origin, used for `metadataBase`, canonical URLs, and
 * Open Graph tags. Resolved from the environment so preview and production
 * deployments produce correct absolute URLs, with a localhost fallback for dev.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteName = "Handcrafted Marketplace";
