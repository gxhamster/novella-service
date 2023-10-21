export const vercelIsProduction =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" || "";
export const vercelProductionUrl = process.env.NEXT_PUBLIC_VERCEL_URL || "";
