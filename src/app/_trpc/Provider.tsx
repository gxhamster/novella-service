"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./client";

type ProviderProps = {
  children: React.ReactNode;
};

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    if (process.env.PROD_DOMAIN) {
      return `https://${process.env.PROD_DOMAIN}`;
    }

    throw new Error("Cannot find PROD_DOMAIN env variable");
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default function Provider({ children }: ProviderProps) {
  const queryClient = new QueryClient();
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
      }),
    ],
  });
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
