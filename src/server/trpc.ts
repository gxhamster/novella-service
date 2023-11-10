// TRPC Router
import { initTRPC } from "@trpc/server";
import { inferAsyncReturnType } from "@trpc/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/supabase/types/types";
import { cookies } from "next/headers";

export async function createContext() {
  const supabase = createRouteHandlerClient<Database>({
    cookies,
  });
  return { supabase };
}

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
