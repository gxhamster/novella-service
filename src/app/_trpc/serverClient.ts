// TRPC instance to use in server components
import { appRouter } from "@/server";
// import { httpBatchLink } from "@trpc/client";
import { createContext } from "../api/trpc/[trpc]/route";
import { vercelIsProduction, vercelProductionUrl } from "@/productionEnv";

const url = vercelIsProduction
  ? `${vercelProductionUrl}/api/trpc`
  : "http://localhost:3000/api/trpc";

export const serverClient = appRouter.createCaller({
  // links: [httpBatchLink({ url })],
  supabase: createContext().supabase,
});
