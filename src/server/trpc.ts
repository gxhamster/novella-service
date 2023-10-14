// TRPC Router
import { initTRPC } from "@trpc/server";
import { createContext } from "@/app/api/trpc/[trpc]/route";

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
