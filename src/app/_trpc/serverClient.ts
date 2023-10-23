// TRPC instance to use in server components
import { appRouter } from "@/server";
import { createContext } from "../api/trpc/[trpc]/route";

export const serverClient = appRouter.createCaller(await createContext());
