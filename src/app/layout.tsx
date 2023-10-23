import "./globals.css";
import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import Provider from "./_trpc/Provider";

// Fixes the DYNAMIC_SERVER_USAGE error that occurs when we use a router handler client
// for supabase with TRPC
export const dynamic = "force-dynamic";

const ibmPlex = IBM_Plex_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["cyrillic"],
});

export const metadata: Metadata = {
  title: "Novella",
  description: "Library management service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Always set the the theme to dark mode
    <html lang="en" style={{ colorScheme: "dark" }}>
      <body
        className={`${ibmPlex.className} min-h-full flex flex-col overflow-hidden bg-surface-100 text-surface-950`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
