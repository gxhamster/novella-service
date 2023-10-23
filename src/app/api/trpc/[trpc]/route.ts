import { appRouter } from "@/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { inferAsyncReturnType } from "@trpc/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/supabase/types/supabase";

// export async function createInnerTRPCContext() {
//   const supabase = await supabaseRouterHandlerClient();
//   return {
//     supabase,
//   };
// }

// export async function createContext() {
//   const contextInner = await createInnerTRPCContext();

//   return {
//     ...contextInner,
//   };
// }

// export async function createContext() {
//   const supabase = await supabaseRouterHandlerClient();
//   return { supabase };
// }

export async function createContext() {
  const supabase = createRouteHandlerClient<Database>({
    cookies,
  });
  return { supabase };
}

export type Context = inferAsyncReturnType<typeof createContext>;

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });
};

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
