// TRPC instance to use in server components
import { appRouter } from "@/server";
// import { httpBatchLink } from "@trpc/client";
import { createContext } from "../api/trpc/[trpc]/route";

export const serverClient = appRouter.createCaller({
  // links: [httpBatchLink({ url })],
  supabase: createContext().supabase,
});
