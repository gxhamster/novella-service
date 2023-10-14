// TRPC instance to use in client components
import { type AppRouter } from "@/server";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
