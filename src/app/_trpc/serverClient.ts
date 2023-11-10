// TRPC instance to use in server components
import { appRouter } from "@/server";
import { createContext } from "@/server/trpc";

export const serverClient = appRouter.createCaller(await createContext());
