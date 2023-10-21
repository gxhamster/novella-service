import { appRouter } from "@/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/supabase/types/supabase";
import { inferAsyncReturnType } from "@trpc/server";

export const dynamic = "force-dynamic";

export function createContext() {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  return { supabase };
}
export type Context = inferAsyncReturnType<typeof createContext>;

const handler = async (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
