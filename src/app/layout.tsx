import type { Metadata } from "next";
import Provider from "./_trpc/Provider";
import { ColorSchemeScript } from "@mantine/core";
import "./globals.css";
import MantineConfiguration from "./MantineConfiguration";

// Fixes the DYNAMIC_SERVER_USAGE error that occurs when we use a router handler client
// for supabase with TRPC
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Novella",
  description: "Library management service",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body
        className={`min-h-full flex flex-col overflow-hidden bg-dark-9 text-surface-950`}
      >
        <MantineConfiguration>
          <Provider>{children}</Provider>
        </MantineConfiguration>
      </body>
    </html>
  );
}
