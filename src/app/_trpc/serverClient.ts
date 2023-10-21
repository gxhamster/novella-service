// TRPC instance to use in server components
import { appRouter } from "@/server";
// import { httpBatchLink } from "@trpc/client";
import { createContext } from "../api/trpc/[trpc]/route";

export const isProduction =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" || "";
export const productionUrl = process.env.NEXT_PUBLIC_VERCEL_URL || "";

const url = isProduction
  ? `${productionUrl}/api/trpc`
  : "http://localhost:3000/api/trpc";

export const serverClient = appRouter.createCaller({
  // links: [httpBatchLink({ url })],
  supabase: createContext().supabase,
});
